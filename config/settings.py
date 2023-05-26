
from pydantic import BaseSettings


class Settings(BaseSettings):
    db_url: str = "sqlite:///./sql_app.db"

    class Config:
        env_file = ".env"