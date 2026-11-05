from stable_baselines3 import PPO


class MemoryPolicy:
    """
    RL policy for deciding memory actions.
    """

    def __init__(
        self,
        environment
    ):
        self.environment = environment

        self.model = PPO(
            "MlpPolicy",
            environment,
            verbose=1
        )

    def train(
        self,
        total_timesteps: int = 10_000
    ):

        self.model.learn(
            total_timesteps=total_timesteps
        )

    def predict(
        self,
        state
    ):

        action, _ = self.model.predict(
            state,
            deterministic=True
        )

        return int(action)