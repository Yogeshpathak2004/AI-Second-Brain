class MemoryFeatureEngineer:
    """
    Creates ML features for memory evaluation.
    """

    def create_features(
        self,
        importance: float,
        usage: float,
        recency: float,
        relevance: float,
        confidence: float
    ) -> list:

        return [
            importance,
            usage,
            recency,
            relevance,
            confidence
        ]