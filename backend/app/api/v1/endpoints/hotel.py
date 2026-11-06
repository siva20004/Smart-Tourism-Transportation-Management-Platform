from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.core.database import get_db
from backend.app.models.entities import HotelInformation, HotelOccupancyRecord

router = APIRouter()

@router.get("/properties")
def get_hotel_properties(db: Session = Depends(get_db)):
    hotels = db.query(HotelInformation).all()
    results = []
    for h in hotels:
        latest = db.query(HotelOccupancyRecord).filter_by(hotel_id=h.id).order_by(HotelOccupancyRecord.record_date.desc()).first()
        results.append({
            "id": h.id,
            "name": h.name,
            "name_ja": h.name_ja,
            "operator": h.operator,
            "location": h.location,
            "total_rooms": h.total_rooms,
            "latest_record_date": latest.record_date.isoformat() if latest else None,
            "available_rooms": latest.available_rooms if latest else h.total_rooms,
            "occupied_rooms": latest.occupied_rooms if latest else None,
            "occupancy_rate_pct": latest.occupancy_rate if latest else None,
            "data_source": "Fuji Kyuko Hotel Group Daily Property Management System",
            "data_status": "Uploaded Sourced" if latest else "Not Connected / Awaiting Upload"
        })
    return results

@router.get("/occupancy-trends")
def get_occupancy_trends(db: Session = Depends(get_db)):
    records = db.query(
        HotelOccupancyRecord.record_date,
        func.avg(HotelOccupancyRecord.occupancy_rate).label("avg_occ"),
        func.sum(HotelOccupancyRecord.available_rooms).label("total_avail"),
        func.sum(HotelOccupancyRecord.occupied_rooms).label("total_occ")
    ).group_by(HotelOccupancyRecord.record_date)\
     .order_by(HotelOccupancyRecord.record_date.asc())\
     .limit(60)\
     .all()

    return {
        "formula": "Occupancy Rate = (Occupied Rooms / Available Rooms) * 100",
        "data_status": "Uploaded Sourced",
        "source": "Fuji Kyuko Hotel Group Daily Operational Exports",
        "trend": [
            {
                "date": r.record_date.isoformat(),
                "occupancy_rate": round(float(r.avg_occ or 0), 1),
                "available_rooms": int(r.total_avail or 0),
                "occupied_rooms": int(r.total_occ or 0)
            }
            for r in records
        ]
    }
