class MemoryRetrieval:
    """
    Retrieves relevant memories from the vector database.
    """

    def __init__(
        self,
        embedding_model,
        qdrant_manager
    ):
        self.embedding_model = embedding_model
        self.qdrant = qdrant_manager

    def retrieve(
        self,
        query: str,
        limit: int = 5
    ) -> list:
        """
        Convert query into an embedding and
        search Qdrant for relevant memories.
        """

        query_vector = self.embedding_model.encode(
            query
        )

        results = self.qdrant.search(
            query_vector=query_vector,
            limit=limit
        )

        return results