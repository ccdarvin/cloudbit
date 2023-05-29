
from pydantic import BaseSettings


class Settings(BaseSettings):
    db_url: str | None = None

    class Config:
        env_file = ".env"



settings = Settings()