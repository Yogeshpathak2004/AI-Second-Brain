import numpy as np
import gymnasium as gym
from gymnasium import spaces


class MemoryEnvironment(gym.Env):
    """
    Reinforcement learning environment
    for adaptive memory retention.
    """

    def __init__(self):
        super().__init__()

        # State:
        # importance, usage, recency,
        # relevance, confidence
        self.observation_space = spaces.Box(
            low=0.0,
            high=1.0,
            shape=(5,),
            dtype=np.float32
        )

        # Actions:
        # 0 = KEEP
        # 1 = SUMMARIZE
        # 2 = FORGET
        self.action_space = spaces.Discrete(3)

        self.state = np.zeros(
            5,
            dtype=np.float32
        )

    def reset(
        self,
        seed=None,
        options=None
    ):
        super().reset(seed=seed)

        self.state = self.np_random.random(
            5
        ).astype(np.float32)

        return self.state, {}

    def step(
        self,
        action
    ):

        importance = self.state[0]

        if action == 0:
            reward = importance

        elif action == 1:
            reward = 0.5

        else:
            reward = 1.0 - importance

        terminated = True
        truncated = False

        return (
            self.state,
            float(reward),
            terminated,
            truncated,
            {}
        )