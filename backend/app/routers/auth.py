from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid
import hashlib

from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token(user_id: str, email: str) -> str:
    return hashlib.sha256(f"{user_id}{email}myelin_secret".encode()).hexdigest()

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    db_user = User(
        id=user_id,
        email=req.email,
        name=req.name,
        password_hash=hash_password(req.password)
    )
    db.add(db_user)
    db.commit()
    token = make_token(user_id, req.email)
    return {"user_id": user_id, "email": req.email, "name": req.name, "token": token}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or user.password_hash != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = make_token(user.id, user.email)
    return {"user_id": user.id, "email": user.email, "name": user.name, "token": token}