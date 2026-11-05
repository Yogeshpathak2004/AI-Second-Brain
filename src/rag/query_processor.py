class QueryProcessor:
    """
    Processes and prepares user queries for memory retrieval.
    """

    def process(self, query: str) -> str:
        if not query or not query.strip():
            raise ValueError("Query cannot be empty.")

        return query.strip()