from __future__ import annotations


import os
from pydantic import BaseSettings


class Settings(BaseSettings):
    db_url: str 



if os.getenv("TESTING"):
    settings = Settings(_env_file=".env.test")
else:
    settings = Settings(_env_file=".env")