from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "个人网站后台"
    DEBUG: bool = True
    DATABASE_URL: str = ""
    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ADMIN_USERNAME: str = ""
    ADMIN_PASSWORD: str = ""
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"

    class Config:
        env_file = ".env"
        case_sensitive = True



settings = Settings()
