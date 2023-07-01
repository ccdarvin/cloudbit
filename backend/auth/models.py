from __future__ import annotations
from typing import AsyncGenerator, Optional


from fastapi import Depends
from fastapi_users.db import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import ForeignKey, select
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from config.db import Base, async_session_maker, get_async_session

from .schemas import UserRead


class User(SQLAlchemyBaseUserTableUUID, Base):
    first_name: Mapped[Optional[str]]
    last_name: Mapped[Optional[str]]
    

class CloudApp(Base):
    __tablename__ = 'app_cloud'

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]


class CloudAppUser(Base):
    __tablename__ = 'app_cloud_user'

    id: Mapped[int] = mapped_column(primary_key=True)
    app_cloud_id: Mapped[int] = mapped_column(ForeignKey(CloudApp.id))
    user_id: Mapped[str] = mapped_column(ForeignKey(User.id))
    is_creator: Mapped[bool] = mapped_column(default=False)


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)
    
    