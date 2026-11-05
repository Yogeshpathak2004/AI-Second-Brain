from .llm.ollama_client import OllamaClient
from .llm.memory_extractor import MemoryExtractor
from .llm.summarizer import MemorySummarizer

from .embeddings.embedding_model import EmbeddingModel

from .vector_db.qdrant_manager import QdrantManager

from .memory.memory_scoring import MemoryScorer
from .memory.memory_decay import MemoryDecay
from .memory.memory_manager import MemoryManager

from .rag.retriever import Retriever
from .rag.context_builder import ContextBuilder
from .rag.response_generator import ResponseGenerator


class MemoryEngine:
    """
    Central AI Second Brain memory engine.
    """

    def __init__(
        self,
        ollama_url="http://localhost:11434",
        ollama_model="llama2"
    ):

        # -------------------------
        # LLM
        # -------------------------

        self.ollama = OllamaClient(
            base_url=ollama_url,
            model=ollama_model
        )

        self.memory_extractor = MemoryExtractor(
            self.ollama
        )

        self.summarizer = MemorySummarizer(
            self.ollama
        )

        # -------------------------
        # Embeddings
        # -------------------------

        self.embedding_model = EmbeddingModel()

        # -------------------------
        # Vector Database
        # -------------------------

        self.qdrant = QdrantManager(
            vector_size=self.embedding_model.dimension()
        )

        # -------------------------
        # Memory Intelligence
        # -------------------------

        self.scorer = MemoryScorer()

        self.decay = MemoryDecay()

        self.memory_manager = MemoryManager(
            scorer=self.scorer,
            decay_engine=self.decay
        )

        # -------------------------
        # RAG
        # -------------------------

        self.retriever = Retriever(
            embedding_model=self.embedding_model,
            qdrant_manager=self.qdrant
        )

        self.context_builder = ContextBuilder()

        self.response_generator = ResponseGenerator(
            ollama_client=self.ollama
        )

    # =====================================================
    # STORE MEMORY
    # =====================================================

    def store_memory(
        self,
        content: str,
        importance: float = 0.5,
        usage: float = 0.0,
        recency: float = 1.0,
        relevance: float = 1.0,
        confidence: float = 0.8
    ):

        if not content or not content.strip():
            raise ValueError("Memory content cannot be empty.")

        # Generate embedding
        vector = self.embedding_model.encode(content)

        # Evaluate memory
        evaluation = self.memory_manager.evaluate_memory(
            importance=importance,
            usage=usage,
            recency=recency,
            relevance=relevance,
            confidence=confidence,
            days_since_access=0
        )

        # Prepare payload
        payload = {
            "content": content,
            "importance": importance,
            "usage": usage,
            "recency": recency,
            "relevance": relevance,
            "confidence": confidence,
            "memory_score": evaluation["decay_score"],
            "status": evaluation["action"]
        }

        # Store in Qdrant
        memory_id = self.qdrant.add_memory(
            vector=vector,
            payload=payload
        )

        return {
            "memory_id": memory_id,
            "evaluation": evaluation
        }

    # =====================================================
    # RETRIEVE + ANSWER
    # =====================================================

    def ask(
        self,
        query: str,
        limit: int = 5
    ):

        if not query or not query.strip():
            raise ValueError("Query cannot be empty.")

        # Retrieve relevant memories
        memories = self.retriever.retrieve(
            query=query,
            limit=limit
        )

        # Build context
        context = self.context_builder.build(
            memories
        )

        # Generate response
        answer = self.response_generator.generate(
            query=query,
            context=context
        )

        return {
            "answer": answer,
            "memories_used": len(memories)
        }

    # =====================================================
    # CLOSE
    # =====================================================

    def close(self):
        """
        Close local Qdrant connection.
        """

        if hasattr(self, "qdrant"):
            self.qdrant.client.close()