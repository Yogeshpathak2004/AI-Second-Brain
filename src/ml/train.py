from sklearn.model_selection import train_test_split
from .memory_score_model import MemoryScoreModel


def train_memory_model(
    X,
    y
):

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    model = MemoryScoreModel()

    model.train(
        X_train,
        y_train
    )

    score = model.model.score(
        X_test,
        y_test
    )

    print(
        f"Model R² score: {score:.4f}"
    )

    return model