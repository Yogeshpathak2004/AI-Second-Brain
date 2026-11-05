from src.embeddings.embedding_model import EmbeddingModel


def test_embedding_generation():

    model = EmbeddingModel()

    embedding = model.encode(
        "I am learning Artificial Intelligence."
    )

    assert isinstance(embedding, list)
    assert len(embedding) > 0


def test_embedding_dimension():

    model = EmbeddingModel()

    embedding = model.encode(
        "AI Second Brain"
    )

    assert len(embedding) == model.dimension()


def test_multiple_embeddings():

    model = EmbeddingModel()

    texts = [
        "I am learning Python.",
        "I am learning Machine Learning.",
        "I am building an AI project."
    ]

    embeddings = model.encode_many(texts)

    assert len(embeddings) == 3

    assert all(
        isinstance(embedding, list)
        for embedding in embeddings
    )


def test_empty_text():

    model = EmbeddingModel()

    try:

        model.encode("")

        assert False

    except ValueError:

        assert True