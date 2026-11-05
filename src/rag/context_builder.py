class ContextBuilder:
    """
    Builds context from retrieved memories for the LLM.
    """

    def build(self, memories: list) -> str:

        if not memories:
            return "No relevant memories found."

        context_parts = []

        for memory in memories:

            payload = getattr(memory, "payload", {})

            content = payload.get(
                "content",
                ""
            )

            if content:
                context_parts.append(
                    f"- {content}"
                )

        return "\n".join(context_parts)