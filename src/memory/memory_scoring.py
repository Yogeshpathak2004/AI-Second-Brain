class MemoryScorer:
    """
    Calculates the importance score of a memory.
    """

    def __init__(
        self,
        importance_weight: float = 0.30,
        usage_weight: float = 0.20,
        recency_weight: float = 0.20,
        relevance_weight: float = 0.20,
        confidence_weight: float = 0.10
    ):
        self.importance_weight = importance_weight
        self.usage_weight = usage_weight
        self.recency_weight = recency_weight
        self.relevance_weight = relevance_weight
        self.confidence_weight = confidence_weight

    def calculate(
        self,
        importance: float,
        usage: float,
        recency: float,
        relevance: float,
        confidence: float
    ) -> float:
        """
        Calculate weighted memory score.

        All inputs should be between 0 and 1.
        """

        values = [
            importance,
            usage,
            recency,
            relevance,
            confidence
        ]

        if not all(0 <= value <= 1 for value in values):
            raise ValueError(
                "All scoring values must be between 0 and 1."
            )

        score = (
            importance * self.importance_weight
            + usage * self.usage_weight
            + recency * self.recency_weight
            + relevance * self.relevance_weight
            + confidence * self.confidence_weight
        )

        return round(score, 4)

    def get_action(
        self,
        score: float
    ) -> str:
        """
        Decide what should happen to a memory.
        """

        if score >= 0.70:
            return "KEEP"

        if score >= 0.40:
            return "SUMMARIZE"

        return "FORGET"