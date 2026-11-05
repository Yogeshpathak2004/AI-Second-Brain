import math


class MemoryDecay:
    """
    Calculates temporal decay of memories.
    """

    def __init__(
        self,
        decay_rate: float = 0.01
    ):
        self.decay_rate = decay_rate

    def calculate_decay(
        self,
        days_since_access: float
    ) -> float:
        """
        Calculate decay factor using exponential decay.

        D(t) = e^(-lambda * t)
        """

        if days_since_access < 0:
            raise ValueError(
                "Days since access cannot be negative."
            )

        decay = math.exp(
            -self.decay_rate * days_since_access
        )

        return round(decay, 4)

    def apply_decay(
        self,
        memory_score: float,
        days_since_access: float
    ) -> float:
        """
        Apply time decay to memory score.
        """

        decay_factor = self.calculate_decay(
            days_since_access
        )

        final_score = memory_score * decay_factor

        return round(final_score, 4)