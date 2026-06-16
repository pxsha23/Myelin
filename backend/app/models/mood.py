from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    mood = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())