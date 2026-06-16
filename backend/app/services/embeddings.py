import chromadb
from sentence_transformers import SentenceTransformer
import uuid

model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()

def get_or_create_collection(user_id: str):
    return chroma_client.get_or_create_collection(
        name=f"brain_{user_id}",
        metadata={"hnsw:space": "cosine"}
    )

def embed_node(user_id: str, node_id: str, label: str, type: str, description: str = "") -> str:
    collection = get_or_create_collection(user_id)
    text = f"{label} {type} {description}"
    embedding = model.encode(text).tolist()
    chroma_id = str(uuid.uuid4())
    collection.add(
        ids=[chroma_id],
        embeddings=[embedding],
        documents=[text],
        metadatas=[{"node_id": node_id, "label": label, "type": type}]
    )
    return chroma_id

def delete_node_embedding(user_id: str, chroma_id: str):
    try:
        collection = get_or_create_collection(user_id)
        collection.delete(ids=[chroma_id])
    except Exception:
        pass