from dotenv import load_dotenv
load_dotenv()
import pickle
import tempfile
import shutil
import pandas as pd
import numpy as np
import scipy
from catboost import CatBoostClassifier
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tensorflow as tf
from pydantic import BaseModel
from typing import List
class Item(BaseModel):
    lists: List[List[float]]
rabbits = {"3": "Осторожный кролик", "1": "Смелый кролик", "2": "Предприимчивый кролик", "0": "Открытый кролик"}
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=
    [
        "http://localhost:5173/",
        "http://127.0.0.1:5173/",
        "http://178.170.192.87:8000/",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://178.170.192.87:8000",
        "http://178.170.192.87:3000",
        "http://178.170.192.87:3000/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
def mod_user_for_predict(a, gdps, space, classificator, create_vector_user, time_aproximator):
    data = a.sort_values(by=['npo_operation_date_year', 'npo_operation_date_month', 'npo_operation_date_day'])
    if data.shape[0] < 3:
        data = pd.DataFrame(np.repeat(data.values, 30, axis=0))
    u1d = create_vector_user(data)
    class_of_user = classificator.predict(u1d.reshape(1, u1d.shape[0]))
    gdp = list()
    for i in data.loc[:, ['npo_operation_date_month', 'npo_operation_date_year']].to_numpy():
        res = gdps.loc[(gdps['month'] + space['month'] == i[0])
                       & (gdps['year'] + space['year'] == i[1])]
        if res.shape[0]:
            gdp.append(res['gdv'].median())
        else:
            gdp.append(-1)
    data_npo_sum = data['npo_sum'].to_numpy().reshape(1, data.shape[0])
    gdp = np.array(gdp).reshape(1, data.shape[0])
    c = np.append(data_npo_sum, gdp, axis=0)
    f = time_aproximator(c.T, 75).T
    f = f.reshape(1, f.shape[0] * f.shape[1])
    f = np.insert(f, 0, class_of_user)
    return f

def mod_user_for_predict_constant_gdp(a, gdp: int, classificator, create_vector_user, time_aproximator):
    data = a.sort_values(by=['npo_operation_date_year', 'npo_operation_date_month', 'npo_operation_date_day'])
    if data.shape[0] < 3:
        data = pd.DataFrame(np.repeat(data.values, 30, axis=0))
    u1d = create_vector_user(data)
    class_of_user = classificator.predict(u1d.reshape(1, u1d.shape[0]))
    data_npo_sum = data['npo_sum'].to_numpy().reshape(1, data.shape[0])
    gdps = np.full(shape=(1,  data.shape[0]),  fill_value=gdp,  dtype=float)
    c = np.append(data_npo_sum, gdps, axis=0)
    f = time_aproximator(c.T, 75).T
    f = f.reshape(1, f.shape[0] * f.shape[1])
    f = np.insert(f, 0, class_of_user)
    return f

def create_vector_user(user_table):
  important_series_columns_for_vector = [
      'npo_sum',
      'npo_operation_group',
      'npo_operation_date_year',
      'npo_operation_date_month',
      'npo_operation_date_day'
  ]
  important_constant_columns_for_voctor = ['accnt_pnsn_schm',
                                           'npo_accnt_status', 'npo_blnc', 'npo_pmnts_sum', 'npo_pmnts_nmbr',
                                           'npo_ttl_incm', 'npo_accnt_status_date_year',
                                           'npo_accnt_status_date_month', 'npo_accnt_status_date_day',
                                           'npo_frst_pmnt_date_year', 'npo_frst_pmnt_date_month',
                                           'npo_frst_pmnt_date_day', 'npo_lst_pmnt_date_year',
                                           'npo_lst_pmnt_date_month', 'npo_lst_pmnt_date_day', 'gndr', 'brth_yr',
                                           'pstl_code', 'city'
                                           ]
  constant_vector_params = user_table.loc[:, important_constant_columns_for_voctor].describe().loc['mean'].to_numpy()
  series_vector_describe = user_table.loc[:, important_series_columns_for_vector].describe().T
  series_vector_params = series_vector_describe.loc[:, ['mean', 'std', 'min', 'max']].to_numpy().reshape(20, )
  return np.insert(np.append(series_vector_params, constant_vector_params), 0, np.mean(series_vector_describe['count']))

@app.get('/ids')
def get_ips():
    data = pd.read_csv('data/all_in_one_small.csv')
    ids = list(data['clnt_id'].unique())
    return {"ids": ids}

@app.get('/analyzebyid/{id}')
def analyze_basic(id: str):
    cbc_wo_pensia_load = CatBoostClassifier()
    cbc_wo_pensia_load.load_model('Models/classificator_catboost_wo_pensia.pkl')
    data = pd.read_csv('data/all_in_one_small.csv')

    data = data.loc[data.loc[:, "clnt_id"] == id]
    
    gdp = pd.read_csv('data/gdp_processed.csv')
    userdata = mod_user_for_predict (data, gdp, space={'month': 4, 'year': 1}, classificator=cbc_wo_pensia_load, create_vector_user=create_vector_user, time_aproximator = scipy.signal.resample)
    model = tf.keras.saving.load_model("Models/time_series.h5")
    return {"data": model.predict(userdata.reshape(1, userdata.shape[0])).tolist(), "type": userdata[0]}

@app.get('/analyzeall')
def analyze_basic():
    cbc_wo_pensia_load = CatBoostClassifier()
    cbc_wo_pensia_load.load_model('Models/classificator_catboost_wo_pensia.pkl')
    data = pd.read_csv('data/all_in_one_small.csv')
    gdp = pd.read_csv('data/gdp_processed.csv')
    model = tf.keras.saving.load_model("Models/time_series.h5")
    d = list()
    for i in data['clnt_id'].unique()[:50]:
        x = mod_user_for_predict(data.loc[data['clnt_id'] == i], gdp, space={'month': 4, 'year': 1}, classificator=cbc_wo_pensia_load, create_vector_user=create_vector_user, time_aproximator = scipy.signal.resample)
        d.append({'data': model.predict(x.reshape(1, x.shape[0])).tolist(), 'type': x[0]})
    return {"result": d} 

@app.get('/analyzetype/{typeid}')
def analyze_basic(typeid: float):
    cbc_wo_pensia_load = CatBoostClassifier()
    cbc_wo_pensia_load.load_model('Models/classificator_catboost_wo_pensia.pkl')
    data = pd.read_csv('data/all_in_one_small.csv')
    model = tf.keras.saving.load_model("Models/time_series.h5")
    gdp = pd.read_csv('data/gdp_processed.csv')
    d = list()
    for i in data['clnt_id'].unique()[:50]:
        x = create_vector_user(data.loc[data['clnt_id'] == i])
        if cbc_wo_pensia_load.predict(x.reshape(1, x.shape[0]))[0][0] == float(typeid):
            x = mod_user_for_predict(data.loc[data['clnt_id'] == i], gdp, space={'month': 4, 'year': 1}, classificator=cbc_wo_pensia_load, create_vector_user=create_vector_user, time_aproximator = scipy.signal.resample)
            d.append({"data": [model.predict(x.reshape(1, x.shape[0]))[0].tolist()], "type": typeid})
    return {"result": d} 

@app.get('/analyzecustomgdp/{gdp}')
def analyze_basic(gdp: float):
    cbc_wo_pensia_load = CatBoostClassifier()
    cbc_wo_pensia_load.load_model('Models/classificator_catboost_wo_pensia.pkl')
    data = pd.read_csv('data/all_in_one_small.csv')
    model = tf.keras.saving.load_model("Models/time_series.h5")
    d = list()
    for i in data['clnt_id'].unique()[:50]:
        x = mod_user_for_predict_constant_gdp(data.loc[data['clnt_id'] == i], gdp, classificator=cbc_wo_pensia_load, create_vector_user=create_vector_user, time_aproximator = scipy.signal.resample)
        d.append({'data': model.predict(x.reshape(1, x.shape[0])).tolist(), 'type': x[0]})
    return {"result": d} 

@app.get('/')
def analyze_mass():
    return "Placeholder for mass analysis"

@app.post('/means')
def calculate_means(item: Item):
    column_average = [sum(sub_list) / len(sub_list) for sub_list in zip(*(item.lists))]
    return {"average": column_average}


@app.post('/file')
async def create_upload_file(file: UploadFile):
    try:
        with destination.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()  
        return "ok"

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=80)