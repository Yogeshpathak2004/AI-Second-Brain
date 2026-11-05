from .ollama_client import OllamaClient
from .prompts import SUMMARIZATION_SYSTEM_PROMPT


class MemorySummarizer:
    """
    Summarizes multiple related memories into
    a compact long-term memory.
    """

    def __init__(self, ollama_client: OllamaClient):
        self.ollama = ollama_client

    def summarize(self, memories: list[str]) -> str:
        """
        Combine multiple memories into one concise summary.
        """

        if not memories:
            return ""

        formatted_memories = "\n".join(
            f"- {memory}" for memory in memories
        )

        prompt = f"""
Combine the following memories into one concise
and useful long-term memory.

MEMORIES:
{formatted_memories}

Create a single accurate summary.
Do not add information that is not present.
"""

        return self.ollama.generate(
            prompt=prompt,
            system_prompt=SUMMARIZATION_SYSTEM_PROMPT,
            temperature=0.2
        )