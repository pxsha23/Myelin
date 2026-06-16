from pydantic import BaseModel
from datetime import datetime

class MoodCreate(BaseModel):
    mood: str

class MoodResponse(BaseModel):
    id: str
    user_id: str
    mood: str
    created_at: datetime

    class Config:
        from_attributes = True