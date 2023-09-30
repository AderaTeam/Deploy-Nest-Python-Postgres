from dotenv import load_dotenv
load_dotenv()
import pickle
import shutil
import pandas as pd
import scipy
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
def mod_user_for_predict(a, gdps, space, classificator, create_vector_user, time_aproximator):
    data = a.sort_values(by=['npo_operation_date_year', 'npo_operation_date_month', 'npo_operation_date_day'])
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

@app.get('/ids')
def get_ips():
    data = pd.read_csv('data/all_in_one_small.csv')
    ids = list(data['npo_accnt_id'].unique())
    return {"ids": ids}

@app.get('/analyzebyid/{id}')
def analyze_basic(id):
    with open('./functions/create_vector_user.pkl', 'rb') as fp:
        create_vector_user = pickle.load(fp)
    data = pd.read_csv('data/all_in_one_small.csv')
    data = data.loc[data.loc["npo_accnt_id"] == id]
    userdata = mod_user_for_predict(data, time_aproximator = scipy.signal.resample)
    return create_vector_user(userdata)

@app.get('/')
def analyze_mass():
    return "Placeholder for mass analysis"


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