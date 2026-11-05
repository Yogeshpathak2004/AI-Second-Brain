from ..llm.prompts import RESPONSE_SYSTEM_PROMPT


class ResponseGenerator:
    """
    Generates final AI responses using the LLM
    and retrieved memory context.
    """

    def __init__(self, ollama_client):
        self.ollama = ollama_client

    def generate(
        self,
        query: str,
        context: str
    ) -> str:

        prompt = f"""
Relevant memories:

{context}

User question:

{query}

Answer the user using the relevant memories.
Do not invent personal information.
"""

        return self.ollama.generate(
            prompt=prompt,
            system_prompt=RESPONSE_SYSTEM_PROMPT,
            temperature=0.2
        )