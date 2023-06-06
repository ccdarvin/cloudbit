from fastapi import  FastAPI


from .schemas import (
    UserCreate, UserRead, UserUpdate,
)
from .users import auth_backend, current_active_user, fastapi_users



app = FastAPI()

app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/jwt", tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_verify_router(UserRead),
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    tags=["users"],
)
