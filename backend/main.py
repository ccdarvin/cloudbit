from fastapi import FastAPI

from auth.app import app as auth_app

from fastapi_pagination import add_pagination



app = auth_app
add_pagination(app)


@app.get("/")
async def root():
    return {
        "version": "0.0.1",
        "name": "cloudbit.app",
        "https": "https://cloudbit.app"
    }


app.mount('/', app=auth_app)

