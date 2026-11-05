from src.memory.memory_scoring import MemoryScorer
from src.memory.memory_decay import MemoryDecay
from src.memory.memory_update import MemoryUpdater
from src.memory.memory_forgetting import MemoryForgetting
from src.memory.memory_manager import MemoryManager


def test_memory_scoring():

    scorer = MemoryScorer()

    score = scorer.calculate(
        importance=1.0,
        usage=1.0,
        recency=1.0,
        relevance=1.0,
        confidence=1.0
    )

    assert score == 1.0


def test_memory_action_keep():

    scorer = MemoryScorer()

    action = scorer.get_action(
        0.80
    )

    assert action == "KEEP"


def test_memory_action_summarize():

    scorer = MemoryScorer()

    action = scorer.get_action(
        0.50
    )

    assert action == "SUMMARIZE"


def test_memory_action_forget():

    scorer = MemoryScorer()

    action = scorer.get_action(
        0.20
    )

    assert action == "FORGET"


def test_memory_decay():

    decay = MemoryDecay()

    result = decay.calculate_decay(
        0
    )

    assert result == 1.0


def test_memory_decay_over_time():

    decay = MemoryDecay()

    recent = decay.calculate_decay(
        1
    )

    old = decay.calculate_decay(
        100
    )

    assert recent > old


def test_memory_update():

    updater = MemoryUpdater()

    old_memory = {
        "content": "I am learning Python.",
        "version": 1
    }

    updated = updater.update(
        old_memory,
        "I am learning Python and Machine Learning."
    )

    assert updated["content"] == (
        "I am learning Python and Machine Learning."
    )

    assert updated["version"] == 2

    assert "updated_at" in updated


def test_should_update():

    updater = MemoryUpdater()

    old_memory = {
        "content": "I am learning Python."
    }

    result = updater.should_update(
        old_memory,
        "I am learning Machine Learning."
    )

    assert result is True


def test_should_not_update():

    updater = MemoryUpdater()

    old_memory = {
        "content": "I am learning Python."
    }

    result = updater.should_update(
        old_memory,
        "I am learning Python."
    )

    assert result is False


def test_memory_forgetting():

    forgetting = MemoryForgetting()

    memory = {
        "content": "Temporary information",
        "status": "FORGET"
    }

    forgotten = forgetting.forget(
        memory
    )

    assert forgotten["status"] == "FORGOTTEN"

    assert "forgotten_at" in forgotten

    assert "forget_reason" in forgotten


def test_should_forget():

    forgetting = MemoryForgetting()

    result = forgetting.should_forget(
        score=0.20
    )

    assert result is True


def test_should_not_forget():

    forgetting = MemoryForgetting()

    result = forgetting.should_forget(
        score=0.80
    )

    assert result is False


def test_memory_manager():

    scorer = MemoryScorer()

    decay = MemoryDecay()

    manager = MemoryManager(
        scorer=scorer,
        decay_engine=decay
    )

    result = manager.evaluate_memory(
        importance=1.0,
        usage=1.0,
        recency=1.0,
        relevance=1.0,
        confidence=1.0,
        days_since_access=0
    )

    assert "base_score" in result
    assert "decay_score" in result
    assert "action" in result

    assert result["action"] == "KEEP"