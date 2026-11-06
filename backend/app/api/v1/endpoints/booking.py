from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.core.database import get_db
from backend.app.models.entities import BookingRecord

router = APIRouter()

@router.get("/records")
def get_booking_records(
    status: str = Query("all"),
    limit: int = Query(50),
    db: Session = Depends(get_db)
):
    q = db.query(BookingRecord)
    if status != "all":
        q = q.filter(BookingRecord.booking_status == status)
    records = q.order_by(BookingRecord.booking_date.desc()).limit(limit).all()

    return {
        "data_status": "Uploaded Sourced",
        "source": "Authorized Corporate Reservation System Export",
        "total_records": len(records),
        "records": [
            {
                "booking_id": b.booking_id,
                "booking_date": b.booking_date.isoformat(),
                "travel_date": b.travel_date.isoformat(),
                "service_type": b.service_type,
                "destination": b.destination,
                "guest_count": b.guest_count,
                "booking_status": b.booking_status,
                "amount_jpy": b.amount_jpy,
                "source_name": b.source_name
            }
            for b in records
        ]
    }

@router.get("/stats")
def get_booking_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(BookingRecord.id)).scalar() or 0
    revenue = db.query(func.sum(BookingRecord.amount_jpy)).scalar() or 0.0
    confirmed = db.query(func.count(BookingRecord.id)).filter(BookingRecord.booking_status == "Confirmed").scalar() or 0

    return {
        "total_bookings": total,
        "confirmed_bookings": confirmed,
        "total_revenue_jpy": float(revenue),
        "data_status": "Derived Analytics",
        "source": "Aggregated from Authorized Booking Records"
    }
