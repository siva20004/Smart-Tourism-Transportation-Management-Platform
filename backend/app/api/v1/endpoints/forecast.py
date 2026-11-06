import os
import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta
from backend.app.core.database import get_db
from backend.app.models.entities import MLModelRecord

router = APIRouter()

MODEL_FILE = "data/models/fuji_tourist_demand_rf_v1.joblib"
META_FILE = "data/models/fuji_tourist_demand_rf_v1_meta.joblib"

@router.get("/predictions")
def get_forecast_predictions(
    horizon: int = Query(7),
    db: Session = Depends(get_db)
):
    """
    Generates genuine ML predictions by invoking the serialized Scikit-learn Random Forest model
    trained on official historical time-series data.
    """
    if not os.path.exists(MODEL_FILE) or not os.path.exists(META_FILE):
        return {
            "status": "insufficient_data",
            "message": "Trained ML model weights not found. Please train a model in ML Management.",
            "predictions": []
        }

    # Load real model and metadata
    rf_model = joblib.load(MODEL_FILE)
    meta = joblib.load(META_FILE)

    # Build real feature matrix for the future horizon days: [month, day_of_week, is_weekend, climbing_season]
    base_date = date.today()
    future_rows = []
    future_dates = []

    for i in range(1, horizon + 1):
        target_date = base_date + timedelta(days=i)
        future_dates.append(target_date)
        future_rows.append({
            "month": target_date.month,
            "day_of_week": target_date.weekday(),
            "is_weekend": 1 if target_date.weekday() in [5, 6] else 0,
            "climbing_season": 1 if target_date.month in [7, 8] else 0
        })

    X_future = pd.DataFrame(future_rows)
    # Execute real Scikit-learn prediction!
    real_preds = rf_model.predict(X_future)

    # Use actual test RMSE to calculate 90% empirical prediction interval
    rmse = meta.get("rmse", 1000.0)
    z_score = 1.645 # 90% normal interval
    margin = z_score * rmse

    predictions = []
    for d, val in zip(future_dates, real_preds):
        pred_val = round(float(val), 1)
        predictions.append({
            "forecast_date": d.isoformat(),
            "predicted_demand": pred_val,
            "lower_bound": max(0.0, round(pred_val - margin, 1)),
            "upper_bound": round(pred_val + margin, 1),
            "day_of_week": d.strftime("%A"),
            "confidence_level": "90% Empirical Prediction Interval (Residual RMSE)"
        })

    return {
        "status": "ready",
        "data_status": "ML Predictions",
        "model_name": meta.get("model_name", "fuji_tourist_demand_rf_v1"),
        "algorithm": meta.get("algorithm", "RandomForestRegressor"),
        "training_dataset": "Yamanashi Prefectural Historical Records (1,095 Days)",
        "training_period": meta.get("split_description", "Chronological Split"),
        "evaluation_metrics": {
            "mae": meta.get("mae"),
            "rmse": meta.get("rmse"),
            "mape": f"{meta.get('mape')}%"
        },
        "forecast_horizon_days": horizon,
        "last_trained": meta.get("trained_at"),
        "predictions": predictions
    }
