"""Matching utilities: compute similarity between embeddings.

Uses NumPy for batched operations when available for much faster similarity
calculations against many vectors. Falls back to pure Python implementation
when NumPy is not installed.
"""
from typing import Sequence, List
import math

try:
    import numpy as np  # type: ignore
    _HAS_NUMPY = True
except Exception:
    _HAS_NUMPY = False


def cosine_similarity(a: Sequence[float], b: Sequence[float]) -> float:
    if not a or not b:
        return 0.0
    if _HAS_NUMPY:
        a_np = np.array(a, dtype=float)
        b_np = np.array(b, dtype=float)
        na = np.linalg.norm(a_np)
        nb = np.linalg.norm(b_np)
        if na == 0 or nb == 0:
            return 0.0
        return float(np.dot(a_np, b_np) / (na * nb))
    else:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot / (norm_a * norm_b))


def batch_similarity_matrix(vecs_a: List[List[float]], vecs_b: List[List[float]]) -> List[List[float]]:
    """Return matrix of cosine similarities between two lists of vectors.

    If NumPy is available this uses vectorized ops (stack + normalize + dot),
    otherwise falls back to nested python loops.
    """
    if _HAS_NUMPY:
        A = np.array(vecs_a, dtype=float)
        B = np.array(vecs_b, dtype=float)
        # normalize rows
        An = np.linalg.norm(A, axis=1, keepdims=True)
        Bn = np.linalg.norm(B, axis=1, keepdims=True)
        # avoid division by zero
        An[An == 0] = 1.0
        Bn[Bn == 0] = 1.0
        A_norm = A / An
        B_norm = B / Bn
        mat = A_norm.dot(B_norm.T)
        return mat.tolist()
    else:
        return [[cosine_similarity(a, b) for b in vecs_b] for a in vecs_a]
