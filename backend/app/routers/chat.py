from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.node import Node
from app.services.rag import retrieve_relevant_nodes
from app.services.gemini import chat_with_brain

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    user_id: str
    message: str
    mood: str = "focused"

@router.post("/")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # RAG — retrieve relevant nodes
    relevant = retrieve_relevant_nodes(request.user_id, request.message)

    # if RAG returns something use it, else use all nodes
    if relevant:
        node_ids = [r["node_id"] for r in relevant]
        nodes = db.query(Node).filter(Node.id.in_(node_ids)).all()
    else:
        nodes = db.query(Node).filter(Node.user_id == request.user_id).all()

    nodes_data = [
        {"label": n.label, "type": n.type, "description": n.description}
        for n in nodes
    ]

    response = await chat_with_brain(request.message, nodes_data, request.mood)
    return {"response": response, "nodes_used": len(nodes_data)}