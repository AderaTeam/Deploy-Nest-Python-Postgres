from dotenv import load_dotenv
load_dotenv()
import pickle
import shutil
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=
    [
        "http://127.0.0.1:5173",
        "http://178.170.192.87:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/ids')
def get_ips():
    data = pd.read_csv('data/all_in_one_small.csv')
    ids = data['npo_accnt_id'].unique()
    return {"ids": ids}

@app.get('/aanalyzebyid/{id}')
def analyze_basic(id):
    with open('functions/mod_user_for_predict.pkl', 'rb') as fp:
        mod_user_for_predict = pickle.load(fp)
    with open('UsefullFuns/create_vector_user.pkl', 'rb') as fp:
        create_vector_user = pickle.load(fp)
    data = pd.read_csv('data/all_in_one_small.csv')
    data = data.loc[data.loc["npo_accnt_id"] == id]
    userdata = mod_user_for_predict(data)
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