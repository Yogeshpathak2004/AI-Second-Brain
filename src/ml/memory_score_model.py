import numpy as np
from sklearn.ensemble import RandomForestRegressor


class MemoryScoreModel:
    """
    ML model for predicting memory importance score.
    """

    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            random_state=42
        )

    def train(
        self,
        X,
        y
    ):
        self.model.fit(X, y)

    def predict(
        self,
        features
    ) -> float:

        features = np.array(
            features
        ).reshape(1, -1)

        prediction = self.model.predict(
            features
        )[0]

        return round(
            float(np.clip(prediction, 0, 1)),
            4
        )