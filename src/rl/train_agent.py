from .environment import MemoryEnvironment
from .memory_policy import MemoryPolicy


def train_agent(
    total_timesteps: int = 10_000
):

    environment = MemoryEnvironment()

    policy = MemoryPolicy(
        environment
    )

    policy.train(
        total_timesteps
    )

    return policy