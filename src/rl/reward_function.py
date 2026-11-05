def calculate_reward(
    action: int,
    memory_importance: float
) -> float:

    if action == 0:       # KEEP
        return memory_importance

    elif action == 1:     # SUMMARIZE
        return 0.5

    elif action == 2:     # FORGET
        return 1.0 - memory_importance

    return 0.0