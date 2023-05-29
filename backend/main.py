from fastapi import FastAPI
from auth.app import app as auth_app
from config.db import engine, Base

app = FastAPI()
app.mount("/auth", auth_app)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)