import numpy as np
from app.services.embeddings import get_embedding

def cosine_sim(a, b):
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def retrieve_relevant_nodes(user_id: str, query: str, all_nodes: list, top_k: int = 5) -> list:
    try:
        query_emb = get_embedding(query)
        scored = [
            {"node_id": n.id, "label": n.label, "type": n.type,
             "score": cosine_sim(query_emb, n.embedding)}
            for n in all_nodes if n.embedding
        ]
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]
    except Exception:
        return []
