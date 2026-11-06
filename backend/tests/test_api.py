import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_api_v1_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "PostgreSQL" in data["database"]["engine"]

def test_dashboard_kpis():
    response = client.get("/api/v1/dashboard/kpis?range_type=30d")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert len(data["kpis"]) >= 5
    # Verify provenance tag exists
    assert all("data_status" in kpi for kpi in data["kpis"])

def test_tourism_destinations():
    response = client.get("/api/v1/tourism/destinations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 6
    names = [d["name"] for d in data]
    assert "Lake Kawaguchiko" in names
    assert "Fuji-Q Highland" in names

def test_transportation_stations():
    response = client.get("/api/v1/transportation/stations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 18
    assert data[0]["station_code"] == "FJ01"
    assert data[-1]["station_code"] == "FJ18"

def test_ml_forecast_endpoint():
    response = client.get("/api/v1/forecast/predictions?horizon=7")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["data_status"] == "ML Predictions"
    assert len(data["predictions"]) == 7

def test_data_sources_list():
    response = client.get("/api/v1/data-sources/list")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 6
    names = [s["name"] for s in data]
    assert any("Japan Meteorological" in n for n in names)

def test_download_tourism_dataset():
    response = client.get("/api/v1/upload/download/tourism")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    lines = response.text.strip().split("\n")
    assert len(lines) > 1000  # 1460 authentic daily records + header
    assert "record_date" in lines[0]

def test_download_hotel_dataset():
    response = client.get("/api/v1/upload/download/hotel")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "occupied_rooms" in response.text

def test_download_booking_dataset():
    response = client.get("/api/v1/upload/download/booking")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "booking_id" in response.text

def test_download_passenger_dataset():
    response = client.get("/api/v1/upload/download/passenger")
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    assert "passenger_count" in response.text

def test_download_template():
    response = client.get("/api/v1/upload/templates/tourism")
    assert response.status_code == 200
    assert "visitor_count" in response.text

