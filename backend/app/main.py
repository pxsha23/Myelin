from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import Base, engine
from app.models.user import User
from app.models.node import Node
from app.models.mood import MoodLog
from app.routers import nodes, chat, auth
from app.routers import mood as mood_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Myelin API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "http://localhost:5173"}
    )

app.include_router(auth.router)
app.include_router(nodes.router)
app.include_router(chat.router)
app.include_router(mood_router.router)

@app.get("/")
def root():
    return {"status": "Myelin API running"}