
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .settings import settings

engine = create_async_engine(settings.db_url)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass


async def get_async_session():
    async with async_session_maker() as session:
        yield session
