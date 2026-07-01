# import chromadb
# from sentence_transformers import SentenceTransformer
# import uuid

# model = SentenceTransformer("all-MiniLM-L6-v2")
# chroma_client = chromadb.Client()


from google import genai
from app.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def get_embedding(text: str) -> list:
    result = client.models.embed_content(
        model="models/embedding-001",
        contents=text
    )
    return result.embeddings[0].values

def embed_node(label: str, type: str, description: str = "") -> list:
    text = f"{label} {type} {description}"
    try:
        return get_embedding(text)
    except Exception:
        return None
