from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.core.database import get_db
from backend.app.models.entities import (
    RailwayStation, RailwayRoute, BusRoute,
    TransportationSchedule, PassengerStatistic
)

router = APIRouter()

@router.get("/stations")
def get_railway_stations(db: Session = Depends(get_db)):
    stations = db.query(RailwayStation).order_by(RailwayStation.order_index.asc()).all()
    return [
        {
            "id": s.id,
            "station_code": s.station_code,
            "name": s.name,
            "name_ja": s.name_ja,
            "line_name": s.line_name,
            "latitude": s.latitude,
            "longitude": s.longitude,
            "elevation_m": s.elevation_m,
            "order_index": s.order_index,
            "data_source": "Official Fujikyuko Line Station Specification",
            "data_status": "Historical Reference"
        }
        for s in stations
    ]

@router.get("/routes")
def get_routes(db: Session = Depends(get_db)):
    rail = db.query(RailwayRoute).all()
    buses = db.query(BusRoute).all()
    return {
        "railway": [
            {
                "id": r.id,
                "route_name": r.route_name,
                "route_name_ja": r.route_name_ja,
                "operator": r.operator,
                "total_stations": r.total_stations,
                "length_km": r.length_km,
                "track_gauge": r.track_gauge,
                "source": "Fuji Sanroku Electric Railway Corporate Profile",
                "data_status": "Official Corporate Data"
            }
            for r in rail
        ],
        "bus": [
            {
                "id": b.id,
                "route_number": b.route_number,
                "name": b.name,
                "name_ja": b.name_ja,
                "operator": b.operator,
                "origin": b.origin,
                "destination": b.destination,
                "frequency_mins": b.frequency_mins,
                "source": "Fujikyu Bus Co., Ltd. Route Network",
                "data_status": "Official Corporate Data"
            }
            for b in buses
        ]
    }

@router.get("/schedules")
def get_schedules(db: Session = Depends(get_db)):
    schedules = db.query(TransportationSchedule).all()
    return {
        "note": "Published timetables represent scheduled departures. They do NOT represent real-time passenger occupancy or live GPS tracking.",
        "data_status": "Official Published Timetable",
        "records": [
            {
                "id": s.id,
                "service_type": s.service_type,
                "trip_identifier": s.trip_identifier,
                "station_or_stop": s.station_or_stop,
                "departure_time": s.departure_time,
                "arrival_time": s.arrival_time,
                "day_type": s.day_type,
                "source_attribution": s.source_attribution
            }
            for s in schedules
        ]
    }

@router.get("/passengers")
def get_passenger_analytics(db: Session = Depends(get_db)):
    records = db.query(
        PassengerStatistic.record_date,
        func.sum(PassengerStatistic.passenger_count).label("total_passengers")
    ).group_by(PassengerStatistic.record_date)\
     .order_by(PassengerStatistic.record_date.desc())\
     .limit(30)\
     .all()

    return {
        "data_status": "Historical Sourced",
        "source": "Fuji Sanroku Electric Railway Passenger Flow Data",
        "description": "Daily recorded ridership on the Fujikyuko Line (Otsuki - Kawaguchiko corridor)",
        "trend": [
            {
                "record_date": r.record_date.isoformat(),
                "passengers": int(r.total_passengers or 0)
            }
            for r in reversed(records)
        ]
    }
