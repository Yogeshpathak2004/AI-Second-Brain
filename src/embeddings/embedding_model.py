from sentence_transformers import SentenceTransformer


class EmbeddingModel:
    """
    Generates vector embeddings for memories and queries.
    """

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2"
    ):
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)

    def encode(self, text: str) -> list[float]:
        """
        Convert a single text into an embedding vector.
        """

        if not text or not text.strip():
            raise ValueError("Text cannot be empty.")

        embedding = self.model.encode(
            text,
            normalize_embeddings=True
        )

        return embedding.tolist()

    def encode_many(
        self,
        texts: list[str]
    ) -> list[list[float]]:
        """
        Convert multiple texts into embedding vectors.
        """

        if not texts:
            return []

        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True
        )

        return embeddings.tolist()

    def dimension(self) -> int:
        """
        Return embedding vector dimension.
        """

        return self.model.get_sentence_embedding_dimension()