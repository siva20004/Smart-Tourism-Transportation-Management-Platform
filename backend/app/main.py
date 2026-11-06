import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.services.seed_data import seed_database
from backend.app.api.v1.endpoints import (
    health, auth, dashboard, tourism, transportation,
    forecast, hotel, booking, assistant, routes,
    data_sources, upload, ml_models, reports
)

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("fuji_dx.main")

# Initialize FastAPI App
app = FastAPI(
    title="FUJI SMART DX – AI-Powered Smart Tourism & Transportation Management System",
    description="Enterprise DX platform for Fuji Kyuko Co., Ltd., Japan – Railways, Buses, Tourism & Hotels around Mount Fuji.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
origins = settings.CORS_ORIGINS
if isinstance(origins, str):
    import json
    try:
        origins = json.loads(origins)
    except Exception:
        origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
def on_startup():
    logger.info("Initializing database schema and checking seed data...")
    try:
        seed_database()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error during startup database seed: {e}")

# Root Health Check
@app.get("/health", tags=["Health"])
def root_health():
    from backend.app.core.database import SessionLocal
    from sqlalchemy import text
    db = SessionLocal()
    db_status = "connected"
    try:
        db.execute(text("SELECT 1;"))
    except Exception as e:
        db_status = f"disconnected: {e}"
    finally:
        db.close()
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "FUJI SMART DX",
        "database": db_status
    }

# API V1 Router
api_v1 = settings.API_V1_STR
app.include_router(health.router, prefix=api_v1, tags=["Health"])
app.include_router(auth.router, prefix=f"{api_v1}/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix=f"{api_v1}/dashboard", tags=["Dashboard"])
app.include_router(tourism.router, prefix=f"{api_v1}/tourism", tags=["Tourism"])
app.include_router(transportation.router, prefix=f"{api_v1}/transportation", tags=["Transportation"])
app.include_router(forecast.router, prefix=f"{api_v1}/forecast", tags=["Forecasting"])
app.include_router(hotel.router, prefix=f"{api_v1}/hotel", tags=["Hotels"])
app.include_router(booking.router, prefix=f"{api_v1}/booking", tags=["Bookings"])
app.include_router(assistant.router, prefix=f"{api_v1}/assistant", tags=["AI Assistant"])
app.include_router(routes.router, prefix=f"{api_v1}/routes", tags=["Routes"])
app.include_router(data_sources.router, prefix=f"{api_v1}/data-sources", tags=["Data Sources"])
app.include_router(upload.router, prefix=f"{api_v1}/upload", tags=["Upload & Validation"])
app.include_router(ml_models.router, prefix=f"{api_v1}/ml", tags=["Machine Learning"])
app.include_router(reports.router, prefix=f"{api_v1}/reports", tags=["Reports"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
