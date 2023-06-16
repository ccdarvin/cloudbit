from fastapi import  FastAPI
from .routers import router as cloud_app_router

from .schemas import (
    UserCreate, UserRead, UserUpdate,
)
from .users import auth_backend, fastapi_users



app = FastAPI()

app.include_router(cloud_app_router, tags=["cloud_app"])

app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/auth",
    tags=["users"],
)
