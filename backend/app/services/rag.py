import numpy as np
from sqlalchemy.orm import Session
from app.models.node import Node
from app.services.embeddings import get_embedding

def cosine_sim(a, b):
    a, b = np.array(a), np.array(b)
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

def retrieve_relevant_nodes(user_id: str, query: str, db: Session, top_k: int = 5) -> list:
    try:
        query_emb = get_embedding(query)
        nodes = db.query(Node).filter(
            Node.user_id == user_id,
            Node.embedding.isnot(None)
        ).all()
        scored = [
            {"node_id": n.id, "label": n.label, "type": n.type,
             "score": cosine_sim(query_emb, n.embedding)}
            for n in nodes
        ]
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]
    except Exception:
        return []
