from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse

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

@app.get('/{id}')
def analyze_basic(id):

    return "Your ID is " + id

@app.get('/')
def analyze_mass():
    return "Placeholder for mass analysis"


