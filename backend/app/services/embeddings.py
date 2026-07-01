# import chromadb
# from sentence_transformers import SentenceTransformer
# import uuid

# model = SentenceTransformer("all-MiniLM-L6-v2")
# chroma_client = chromadb.Client()


from google import genai
from app.config import GEMINI_API_KEY
import uuid

client = genai.Client(api_key=GEMINI_API_KEY)

def get_embedding(text: str) -> list[float]:
    result = client.models.embed_content(
        model="models/embedding-001",
        contents=text
    )
    return result.embeddings[0].values

def embed_node(user_id: str, node_id: str, label: str, type: str, description: str = "") -> list[float]:
    text = f"{label} {type} {description}"
    return get_embedding(text)
