class Retriever:
    """
    Retrieves relevant memories using embeddings and Qdrant.
    """

    def __init__(self, embedding_model, qdrant_manager):
        self.embedding_model = embedding_model
        self.qdrant = qdrant_manager

    def retrieve(self, query: str, limit: int = 5):
        query_vector = self.embedding_model.encode(query)

        return self.qdrant.search(
            query_vector=query_vector,
            limit=limit
        )