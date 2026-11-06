from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="analyst") # admin, analyst, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DataSource(Base):
    __tablename__ = "data_sources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50), nullable=False) # weather, government, official_corporate, openstreetmap, user_upload
    endpoint_or_ref = Column(String(500), nullable=True)
    connection_status = Column(String(50), default="untested") # connected, degraded, disconnected, not_configured
    auth_status = Column(String(50), default="not_required") # authenticated, missing_key, invalid_key, not_required
    last_sync = Column(DateTime, nullable=True)
    last_error = Column(Text, nullable=True)
    update_frequency = Column(String(50), default="Daily")
    data_coverage = Column(String(255), nullable=True)
    imported_records_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Destination(Base):
    __tablename__ = "destinations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    name_ja = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False) # Mountain, Lake, Amusement Park, Shrine, Heritage
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    description_ja = Column(Text, nullable=True)
    official_website = Column(String(255), nullable=True)
    elevation_m = Column(Integer, nullable=True)
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=True)

class RailwayStation(Base):
    __tablename__ = "railway_stations"
    id = Column(Integer, primary_key=True, index=True)
    station_code = Column(String(20), unique=True, nullable=False) # e.g. FJ01, FJ18
    name = Column(String(100), nullable=False)
    name_ja = Column(String(100), nullable=False)
    line_name = Column(String(100), default="Fujikyuko Line") # Otsuki Line / Kawaguchiko Line
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Integer, nullable=True)
    order_index = Column(Integer, nullable=False)

class RailwayRoute(Base):
    __tablename__ = "railway_routes"
    id = Column(Integer, primary_key=True, index=True)
    route_name = Column(String(100), nullable=False) # Fujikyuko Line (Otsuki - Kawaguchiko)
    route_name_ja = Column(String(100), nullable=False)
    operator = Column(String(100), default="Fuji Kyuko Co., Ltd. / Fuji Sanroku Electric Railway")
    total_stations = Column(Integer, default=18)
    length_km = Column(Float, default=26.6)
    track_gauge = Column(String(20), default="1067mm")

class BusRoute(Base):
    __tablename__ = "bus_routes"
    id = Column(Integer, primary_key=True, index=True)
    route_number = Column(String(50), nullable=False) # e.g. "Red Line", "Green Line", "Mount Fuji 5th Station Shuttle"
    name = Column(String(100), nullable=False)
    name_ja = Column(String(100), nullable=False)
    operator = Column(String(100), default="Fujikyu Bus Co., Ltd.")
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    frequency_mins = Column(Integer, nullable=True)

class TransportationSchedule(Base):
    __tablename__ = "transportation_schedules"
    id = Column(Integer, primary_key=True, index=True)
    service_type = Column(String(50), nullable=False) # Railway, Express Bus, Local Sightseeing Bus
    trip_identifier = Column(String(100), nullable=False)
    station_or_stop = Column(String(100), nullable=False)
    departure_time = Column(String(20), nullable=False)
    arrival_time = Column(String(20), nullable=True)
    day_type = Column(String(20), default="Weekday") # Weekday, Saturday, Sunday/Holiday
    source_attribution = Column(String(200), default="Official Fuji Kyuko Timetable (Published)")

class TourismStatistic(Base):
    __tablename__ = "tourism_statistics"
    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=True)
    record_date = Column(Date, nullable=False, index=True)
    visitor_count = Column(Integer, nullable=False)
    domestic_visitors = Column(Integer, nullable=True)
    international_visitors = Column(Integer, nullable=True)
    country_breakdown = Column(JSON, nullable=True)
    data_type = Column(String(50), default="historical") # live, historical, uploaded, derived
    source_name = Column(String(150), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class PassengerStatistic(Base):
    __tablename__ = "passenger_statistics"
    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, ForeignKey("railway_stations.id"), nullable=True)
    record_date = Column(Date, nullable=False, index=True)
    passenger_count = Column(Integer, nullable=False)
    service_type = Column(String(50), default="Railway")
    source_name = Column(String(150), nullable=False)
    data_type = Column(String(50), default="historical")
    created_at = Column(DateTime, default=datetime.utcnow)

class HotelInformation(Base):
    __tablename__ = "hotel_information"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    name_ja = Column(String(150), nullable=False)
    operator = Column(String(100), default="Fuji Kyuko Hotel Group")
    location = Column(String(200), nullable=False)
    total_rooms = Column(Integer, nullable=False)
    data_source_id = Column(Integer, ForeignKey("data_sources.id"), nullable=True)

class HotelOccupancyRecord(Base):
    __tablename__ = "hotel_occupancy_records"
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotel_information.id"), nullable=False)
    record_date = Column(Date, nullable=False, index=True)
    available_rooms = Column(Integer, nullable=False)
    occupied_rooms = Column(Integer, nullable=False)
    occupancy_rate = Column(Float, nullable=False) # (occupied / available) * 100
    source_name = Column(String(150), nullable=False)
    data_type = Column(String(50), default="uploaded")
    created_at = Column(DateTime, default=datetime.utcnow)

class BookingRecord(Base):
    __tablename__ = "booking_records"
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String(100), unique=True, index=True, nullable=False)
    booking_date = Column(Date, nullable=False, index=True)
    travel_date = Column(Date, nullable=False)
    service_type = Column(String(50), nullable=False) # Hotel, Express Bus, Fuji-Q Pass, Sightseeing Tour
    destination = Column(String(100), nullable=False)
    guest_count = Column(Integer, default=1)
    booking_status = Column(String(50), default="Confirmed") # Confirmed, Cancelled, Completed
    amount_jpy = Column(Float, nullable=True)
    source_name = Column(String(150), default="Authorized Corporate Upload")
    created_at = Column(DateTime, default=datetime.utcnow)

class WeatherRecord(Base):
    __tablename__ = "weather_records"
    id = Column(Integer, primary_key=True, index=True)
    region_code = Column(String(20), default="190010") # Yamanashi / Kawaguchiko area
    region_name = Column(String(100), default="Kawaguchiko / Mount Fuji")
    observation_time = Column(DateTime, nullable=False, index=True)
    weather_condition = Column(String(100), nullable=False) # Sunny, Rain, Cloudy, Snow
    temperature_celsius = Column(Float, nullable=True)
    rain_probability_pct = Column(Integer, nullable=True)
    visibility_status = Column(String(50), nullable=True) # Clear Fuji View, Partially Obscured, Obscured
    source_name = Column(String(150), default="Japan Meteorological Agency (JMA)")
    is_live = Column(Boolean, default=True)

class MLModelRecord(Base):
    __tablename__ = "ml_models"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), nullable=False)
    target_metric = Column(String(100), nullable=False) # Tourist Demand / Railway Passengers
    algorithm = Column(String(100), nullable=False) # Random Forest, Ridge Regression, XGBoost
    version = Column(String(50), default="1.0.0")
    training_dataset = Column(String(200), nullable=False)
    training_period = Column(String(100), nullable=False)
    mae = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    mape = Column(Float, nullable=True)
    status = Column(String(50), default="trained") # trained, evaluating, ready, insufficient_data
    model_path = Column(String(300), nullable=True)
    last_trained = Column(DateTime, default=datetime.utcnow)

class MLPrediction(Base):
    __tablename__ = "ml_predictions"
    id = Column(Integer, primary_key=True, index=True)
    model_id = Column(Integer, ForeignKey("ml_models.id"), nullable=False)
    forecast_date = Column(Date, nullable=False, index=True)
    predicted_value = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=True)
    upper_bound = Column(Float, nullable=True)
    forecast_horizon_days = Column(Integer, default=7)
    created_at = Column(DateTime, default=datetime.utcnow)

class DataImportHistory(Base):
    __tablename__ = "data_import_history"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    import_type = Column(String(50), nullable=False) # tourism_stats, passenger_stats, hotel, bookings
    total_records = Column(Integer, default=0)
    valid_records = Column(Integer, default=0)
    invalid_records = Column(Integer, default=0)
    status = Column(String(50), default="completed") # completed, failed, partial
    uploaded_by = Column(String(100), default="admin@fujikyu.co.jp")
    created_at = Column(DateTime, default=datetime.utcnow)

class ReportRecord(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    report_title = Column(String(255), nullable=False)
    report_type = Column(String(100), nullable=False) # Daily, Weekly Transportation, Monthly Tourism, Hotel, Data Quality
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    summary_metrics = Column(JSON, nullable=True)
    data_sources_used = Column(JSON, nullable=True)
    generated_by = Column(String(100), default="System")
    created_at = Column(DateTime, default=datetime.utcnow)
