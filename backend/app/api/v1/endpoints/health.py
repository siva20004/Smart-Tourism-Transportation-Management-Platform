import logging
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.app.core.database import get_db

logger = logging.getLogger("fuji_dx.health")
router = APIRouter()

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    db_version = "Unknown"
    try:
        res = db.execute(text("SELECT version();")).fetchone()
        if res:
            db_version = res[0]
    except Exception as e:
        logger.error(f"Health check DB error: {e}")
        db_status = f"unhealthy ({str(e)})"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": "FUJI SMART DX – Enterprise Backend API",
        "operator": "Fuji Kyuko Co., Ltd.",
        "database": {
            "status": db_status,
            "version": db_version,
            "engine": "PostgreSQL 18"
        },
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "api_v1": "/api/v1"
        }
    }
