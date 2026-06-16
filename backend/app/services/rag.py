from app.services.embeddings import get_or_create_collection, model

def retrieve_relevant_nodes(user_id: str, query: str, top_k: int = 5) -> list:
    try:
        collection = get_or_create_collection(user_id)
        query_embedding = model.encode(query).tolist()
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, collection.count())
        )
        if not results["metadatas"][0]:
            return []
        return [
            {
                "node_id": m["node_id"],
                "label": m["label"],
                "type": m["type"],
                "score": 1 - d
            }
            for m, d in zip(
                results["metadatas"][0],
                results["distances"][0]
            )
        ]
    except Exception:
        return []