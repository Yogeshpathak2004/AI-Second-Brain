from .memory_score_model import MemoryScoreModel


def predict_memory_score(
    model: MemoryScoreModel,
    features: list
) -> float:

    return model.predict(
        features
    )