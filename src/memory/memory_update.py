from datetime import datetime


class MemoryUpdater:
    """
    Handles updating an existing memory with
    newer information.
    """

    def update(
        self,
        old_memory: dict,
        new_information: str
    ) -> dict:
        """
        Update an existing memory.
        """

        updated_memory = old_memory.copy()

        updated_memory["content"] = new_information
        updated_memory["updated_at"] = (
            datetime.utcnow().isoformat()
        )

        updated_memory["version"] = (
            old_memory.get("version", 1) + 1
        )

        return updated_memory

    def should_update(
        self,
        old_memory: dict,
        new_information: str
    ) -> bool:
        """
        Basic check to determine whether the
        existing memory content differs.
        """

        old_content = old_memory.get(
            "content",
            ""
        ).strip().lower()

        new_content = new_information.strip().lower()

        return old_content != new_content