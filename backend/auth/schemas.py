import uuid
from typing import Optional
from pydantic import BaseModel, constr

from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    first_name: Optional[str]
    last_name: Optional[str]


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    first_name: Optional[str]
    last_name: Optional[str]
    

### Cloud App


class CloudAppRead(BaseModel):
    id: int
    name: str
    code: str
    creator: UserRead
    is_creator: bool


class CloudAppCreate(BaseModel):
    name: str
    # code is str without blank and olso acepted alphanumeric and middle line
    code: constr(
        min_length=5, 
        regex=r"^[a-zA-Z0-9_-]+$"
    )
    


class CloudAppUpdate(BaseModel):
    name: Optional[str]
    is_creator: Optional[bool]

