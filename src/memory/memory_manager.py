from datetime import datetime


class MemoryManager:
    """
    Coordinates memory creation, scoring,
    decay and decision making.
    """

    def __init__(
        self,
        scorer,
        decay_engine
    ):
        self.scorer = scorer
        self.decay_engine = decay_engine

    def evaluate_memory(
        self,
        importance: float,
        usage: float,
        recency: float,
        relevance: float,
        confidence: float,
        days_since_access: float
    ) -> dict:
        """
        Calculate the final memory score
        and determine the memory action.
        """

        base_score = self.scorer.calculate(
            importance=importance,
            usage=usage,
            recency=recency,
            relevance=relevance,
            confidence=confidence
        )

        final_score = self.decay_engine.apply_decay(
            memory_score=base_score,
            days_since_access=days_since_access
        )

        action = self.scorer.get_action(
            final_score
        )

        return {
            "base_score": base_score,
            "decay_score": final_score,
            "action": action,
            "evaluated_at": datetime.utcnow().isoformat()
        }