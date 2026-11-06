import os
import json
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    APP_NAME: str = "FUJI SMART DX"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/fuji_smart_dx"

    # Security
    SECRET_KEY: str = "fuji_kyuko_dx_secret_key_production_grade_change_in_real_deployment_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Demo Accounts
    INITIAL_ADMIN_EMAIL: str = "admin@fujikyu.co.jp"
    INITIAL_ADMIN_PASSWORD: str = "FujiSmartAdmin2026!"
    INITIAL_ANALYST_EMAIL: str = "analyst@fujikyu.co.jp"
    INITIAL_ANALYST_PASSWORD: str = "FujiSmartAnalyst2026!"

    # Integrations
    JMA_BASE_URL: str = "https://www.jma.go.jp/bosai/forecast/data/forecast"
    JMA_YAMANASHI_CODE: str = "190000"
    ESTAT_APP_ID: str = ""
    JNTO_API_KEY: str = ""
    MLIT_API_KEY: str = ""
    OPENSTREETMAP_NOMINATIM_URL: str = "https://nominatim.openstreetmap.org"
    OPENSTREETMAP_ROUTING_URL: str = "https://router.project-osrm.org"

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
