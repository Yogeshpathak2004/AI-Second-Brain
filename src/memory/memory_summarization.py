from ..llm.summarizer import MemorySummarizer


class MemorySummarization:
    """
    Handles summarization of related memories.
    """

    def __init__(
        self,
        summarizer: MemorySummarizer
    ):
        self.summarizer = summarizer

    def summarize_memories(
        self,
        memories: list[str]
    ) -> str:
        """
        Convert multiple related memories
        into one compact memory.
        """

        if not memories:
            return ""

        if len(memories) == 1:
            return memories[0]

        return self.summarizer.summarize(
            memories
        )