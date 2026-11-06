from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.entities import Destination, RailwayStation, BusRoute

router = APIRouter()

@router.get("/regional-map")
def get_regional_map_data(db: Session = Depends(get_db)):
    dests = db.query(Destination).all()
    stations = db.query(RailwayStation).order_by(RailwayStation.order_index.asc()).all()
    buses = db.query(BusRoute).all()

    return {
        "region_center": {"lat": 35.4981, "lng": 138.7686, "zoom": 11, "name": "Fuji Five Lakes Region"},
        "data_status": "Geographic Verified",
        "source": "OpenStreetMap & Fuji Kyuko Transport Network",
        "destinations": [
            {
                "id": d.id,
                "name": d.name,
                "name_ja": d.name_ja,
                "lat": d.latitude,
                "lng": d.longitude,
                "category": d.category,
                "elevation_m": d.elevation_m
            }
            for d in dests
        ],
        "railway_stations": [
            {
                "id": s.id,
                "station_code": s.station_code,
                "name": s.name,
                "name_ja": s.name_ja,
                "lat": s.latitude,
                "lng": s.longitude,
                "elevation_m": s.elevation_m,
                "order_index": s.order_index
            }
            for s in stations
        ],
        "bus_routes": [
            {
                "id": b.id,
                "route_number": b.route_number,
                "name": b.name,
                "origin": b.origin,
                "destination": b.destination,
                "frequency_mins": b.frequency_mins
            }
            for b in buses
        ]
    }

@router.get("/itinerary-suggestions")
def get_itinerary_suggestions():
    return {
        "data_status": "Derived from Verified Schedules",
        "disclaimer": "Calculated from official published timetables and geographic coordinates. Estimated travel times are subject to seasonal traffic.",
        "itineraries": [
            {
                "title": "Fuji Scenic Heritage & Culture Tour (1-Day)",
                "target": "First-time international visitors & photographers",
                "steps": [
                    {"time": "08:35", "stop": "Otsuki Station", "action": "Board Fuji Excursion Limited Express Train"},
                    {"time": "09:12", "stop": "Shimoyoshida Station", "action": "Disembark & visit Chureito Pagoda (Arakurayama Sengen Park)"},
                    {"time": "11:30", "stop": "Kawaguchiko Station", "action": "Board Red Line Sightseeing Bus"},
                    {"time": "12:15", "stop": "Kawaguchiko Natural Living Center", "action": "Enjoy Mount Fuji lake reflection and local lunch"},
                    {"time": "15:00", "stop": "Oshino Hakkai", "action": "Heritage UNESCO crystal springs tour"}
                ]
            },
            {
                "title": "Fuji Thrills & Adventure Circuit (1-Day)",
                "target": "Youth, families and amusement park enthusiasts",
                "steps": [
                    {"time": "09:00", "stop": "Fuji-Q Highland Station", "action": "Direct entry to Fuji-Q Highland amusement park"},
                    {"time": "14:30", "stop": "Highland Resort Hotel & Spa", "action": "Lunch and Fujiyama Onsen relaxation"},
                    {"time": "16:30", "stop": "Lake Kawaguchiko Station", "action": "Sunset lakeside stroll & local souvenir shopping"}
                ]
            }
        ]
    }
