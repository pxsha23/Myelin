from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.mood import MoodLog
from app.schemas.mood import MoodCreate, MoodResponse

router = APIRouter(prefix="/mood", tags=["mood"])

@router.post("/", response_model=MoodResponse)
def log_mood(user_id: str, mood: MoodCreate, db: Session = Depends(get_db)):
    log = MoodLog(id=str(uuid.uuid4()), user_id=user_id, mood=mood.mood)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.get("/history", response_model=List[MoodResponse])
def get_mood_history(user_id: str, db: Session = Depends(get_db)):
    return db.query(MoodLog).filter(
        MoodLog.user_id == user_id
    ).order_by(MoodLog.created_at.desc()).limit(30).all()