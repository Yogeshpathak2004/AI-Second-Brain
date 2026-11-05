from datetime import datetime


class MemoryForgetting:
    """
    Handles soft forgetting of low-value memories.
    """

    def forget(
        self,
        memory: dict,
        reason: str = "Low memory score"
    ) -> dict:
        """
        Mark memory as forgotten instead of
        immediately destroying its metadata.
        """

        forgotten_memory = memory.copy()

        forgotten_memory["status"] = "FORGOTTEN"
        forgotten_memory["forgotten_at"] = (
            datetime.utcnow().isoformat()
        )
        forgotten_memory["forget_reason"] = reason

        return forgotten_memory

    def should_forget(
        self,
        score: float,
        threshold: float = 0.40
    ) -> bool:
        """
        Determine whether memory should be forgotten.
        """

        return score < threshold