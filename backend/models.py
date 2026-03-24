from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from database import Base
import datetime

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    video_path = Column(String)
    status = Column(String, default="uploaded")
    progress = Column(Float, default=0.0)
    message = Column(String)
    results = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
