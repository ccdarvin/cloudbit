
from pydantic import BaseSettings


class Settings(BaseSettings):
    db_url: str = "sqlite+aiosqlite:///./test.db"
    
    class Config:
        env_file = ".env"



settings = Settings()