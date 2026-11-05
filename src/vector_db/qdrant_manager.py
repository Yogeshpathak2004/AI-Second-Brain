from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct
)
from typing import Optional
import uuid


class QdrantManager:
    """
    Handles vector storage and semantic search using local Qdrant.
    """

    def __init__(
    self,
    collection_name: str = "ai_second_brain_memory",
    vector_size: int = 384,
    storage_path: str = "qdrant_data"
):
        self.collection_name = collection_name
        self.vector_size = vector_size

        # Local persistent Qdrant storage
        self.client = QdrantClient(
            path=storage_path
        )

        self._create_collection()

    def _create_collection(self):
        """
        Create the memory collection if it does not exist.
        """

        collections = self.client.get_collections()

        existing_collections = [
            collection.name
            for collection in collections.collections
        ]

        if self.collection_name not in existing_collections:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.vector_size,
                    distance=Distance.COSINE
                )
            )

    def add_memory(
        self,
        vector: list[float],
        payload: dict,
        memory_id: Optional[str] = None
    ) -> str:
        """
        Store one memory vector in Qdrant.
        """

        memory_id = memory_id or str(uuid.uuid4())

        point = PointStruct(
            id=memory_id,
            vector=vector,
            payload=payload
        )

        self.client.upsert(
            collection_name=self.collection_name,
            points=[point]
        )

        return memory_id

    def add_memories(
        self,
        memories: list[dict]
    ):
        """
        Store multiple memories.
        """

        points = []

        for memory in memories:

            memory_id = memory.get(
                "memory_id",
                str(uuid.uuid4())
            )

            points.append(
                PointStruct(
                    id=memory_id,
                    vector=memory["vector"],
                    payload=memory["payload"]
                )
            )

        if points:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

    def search(
        self,
        query_vector: list[float],
        limit: int = 5
    ):
        """
        Search for semantically similar memories.
        """

        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )

        return results

    def delete_memory(
        self,
        memory_id: str
    ):
        """
        Delete a memory from Qdrant.
        """

        self.client.delete(
            collection_name=self.collection_name,
            points_selector=[memory_id]
        )

    def count_memories(self) -> int:
        """
        Return total number of stored memories.
        """

        result = self.client.count(
            collection_name=self.collection_name
        )

        return result.count