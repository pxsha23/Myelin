from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NodeCreate(BaseModel):
    label: str
    type: str
    description: Optional[str] = None
    rx: Optional[float] = 0.5
    ry: Optional[float] = 0.5

class NodeUpdate(BaseModel):
    label: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    rx: Optional[float] = None
    ry: Optional[float] = None

class NodeResponse(BaseModel):
    id: str
    user_id: str
    label: str
    type: str
    description: Optional[str]
    status: str
    rx: float
    ry: float
    created_at: datetime

    class Config:
        from_attributes = True