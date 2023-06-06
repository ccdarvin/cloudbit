from fastapi import FastAPI

from auth.app import app as auth_app
from auth.routers import router as cloud_app_router

from fastapi_pagination import add_pagination


app = FastAPI()
app.mount("/auth", auth_app)

app.include_router(cloud_app_router, tags=["Cloud Apps"])


@app.get("/")
async def root():
    return {
        "version": "0.0.1",
        "name": "cloudbit.app",
        "https": "https://cloudbit.app"
    }



add_pagination(app)