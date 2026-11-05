from src.rag.query_processor import QueryProcessor
from src.rag.context_builder import ContextBuilder


def test_query_processor():

    processor = QueryProcessor()

    query = processor.process(
        "What am I learning?"
    )

    assert query == "What am I learning?"


def test_query_processor_removes_spaces():

    processor = QueryProcessor()

    query = processor.process(
        "   What am I learning?   "
    )

    assert query == "What am I learning?"


def test_empty_query():

    processor = QueryProcessor()

    try:

        processor.process("")

        assert False

    except ValueError:

        assert True


def test_context_builder():

    builder = ContextBuilder()

    memories = [
        type(
            "Memory",
            (),
            {
                "payload": {
                    "content": "User is learning Python."
                }
            }
        )(),
        type(
            "Memory",
            (),
            {
                "payload": {
                    "content": "User is learning Machine Learning."
                }
            }
        )()
    ]

    context = builder.build(
        memories
    )

    assert "User is learning Python." in context

    assert "User is learning Machine Learning." in context


def test_empty_context():

    builder = ContextBuilder()

    context = builder.build([])

    assert context == "No relevant memories found."