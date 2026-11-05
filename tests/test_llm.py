from src.llm.memory_extractor import MemoryExtractor
from src.llm.summarizer import MemorySummarizer


class MockOllamaClient:

    def generate(
        self,
        prompt,
        system_prompt=None,
        temperature=0.2
    ):
        return "User is learning Artificial Intelligence."


def test_memory_extractor():

    ollama = MockOllamaClient()

    extractor = MemoryExtractor(
        ollama
    )

    result = extractor.extract(
        "I am learning Artificial Intelligence."
    )

    assert isinstance(result, str)
    assert len(result) > 0


def test_memory_summarizer():

    ollama = MockOllamaClient()

    summarizer = MemorySummarizer(
        ollama
    )

    memories = [
        "User is learning Python.",
        "User is learning Machine Learning.",
        "User is interested in AI."
    ]

    result = summarizer.summarize(
        memories
    )

    assert isinstance(result, str)
    assert len(result) > 0


def test_empty_memory_summarization():

    ollama = MockOllamaClient()

    summarizer = MemorySummarizer(
        ollama
    )

    result = summarizer.summarize([])

    assert result == ""