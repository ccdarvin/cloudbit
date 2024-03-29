from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth.app import app as auth_app

from fastapi_pagination import add_pagination


app = auth_app
add_pagination(app)

# configure CORS
origins = [
    "http://localhost:3000",
    
    "http://example.com:3000",
    "http://auth.example.com:3000",
    "http://dc.example.com:3000",
    
    "https://cloudbit.app",
    "https://auth.cloudbit.app",
    "https://dc.cloudbit.app",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "version": "0.0.1",
        "name": "cloudbit.app",
        "https": "https://cloudbit.app"
    }
