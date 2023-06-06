import os
# set the TESTING environment variable
os.environ["TESTING"] = "True"

from httpx import AsyncClient

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from config.settings import settings
from config.db import Base
from main import app

import pytest

engine = create_async_engine(settings.db_url, connect_args={"check_same_thread": False})
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


@pytest.fixture(scope="session")
def anyio_backend():
    return 'asyncio'


@pytest.fixture(autouse=True, scope="session")
async def async_session():
    
    # create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        yield session

    # drop all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():

    async with AsyncClient(app=app, base_url="https://entredata.org") as client:
        yield client

