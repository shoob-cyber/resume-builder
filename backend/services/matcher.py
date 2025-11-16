"""Matching utilities: compute similarity between embeddings."""
from typing import Sequence, List
import math


def cosine_similarity(a: Sequence[float], b: Sequence[float]) -> float:
    if not a or not b:
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))


def batch_similarity_matrix(vecs_a: List[List[float]], vecs_b: List[List[float]]) -> List[List[float]]:
    return [[cosine_similarity(a, b) for b in vecs_b] for a in vecs_a]
