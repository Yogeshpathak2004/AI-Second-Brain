from .ollama_client import OllamaClient
from .prompts import MEMORY_EXTRACTION_SYSTEM_PROMPT


class MemoryExtractor:
    """
    Extracts potentially useful long-term memories
    from user messages using an LLM.
    """

    def __init__(self, ollama_client: OllamaClient):
        self.ollama = ollama_client

    def extract(self, user_message: str) -> str:
        """
        Extract useful memory from a user message.
        """

        prompt = f"""
Analyze the following user message.

USER MESSAGE:
{user_message}

Extract only information that may be useful
for long-term personalized memory.

If there is no useful long-term information,
return exactly:

NO_MEMORY
"""

        result = self.ollama.generate(
            prompt=prompt,
            system_prompt=MEMORY_EXTRACTION_SYSTEM_PROMPT,
            temperature=0.1
        )

        return result