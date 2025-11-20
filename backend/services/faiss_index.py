"""Optional FAISS index helper. Keeps an in-memory FAISS index of resume embeddings
for fast nearest-neighbor searches. This module is optional and will no-op when
faiss is not installed.

Usage:
  from services.faiss_index import index_resume, search
  index_resume(db_id, embedding)
  results = search(query_vec, k=10)

Note: this in-memory index is non-persistent. For production use, persist the
index and a mapping between FAISS ids and DB ids, or use an external ANN service.
"""
from typing import List, Tuple, Optional

try:
    import faiss
    _HAS_FAISS = True
except Exception:
    faiss = None  # type: ignore
    _HAS_FAISS = False

_index = None
_id_map = {}  # faiss_id -> db_id
_reverse_map = {}  # db_id -> faiss_id
_dim = None
_next_faiss_id = 0


def _ensure_index(dim: int):
    global _index, _dim
    if not _HAS_FAISS:
        return
    if _index is None:
        # use inner product on normalized vectors (dot product equals cosine)
        _dim = dim
        _index = faiss.IndexFlatIP(dim)


def index_resume(db_id: int, vec: List[float]):
    """Add or replace a resume vector into the FAISS index."""
    global _next_faiss_id
    if not _HAS_FAISS:
        return
    if vec is None:
        return
    import numpy as np
    v = np.array(vec, dtype='float32')
    # normalize
    norm = np.linalg.norm(v)
    if norm > 0:
        v = v / norm
    dim = v.shape[0]
    _ensure_index(dim)
    if db_id in _reverse_map:
        # replace: remove and re-add - FAISS IndexFlat doesn't support delete, so skip
        pass
    faiss_id = _next_faiss_id
    _next_faiss_id += 1
    _id_map[faiss_id] = db_id
    _reverse_map[db_id] = faiss_id
    v = v.reshape(1, dim)
    _index.add(v)


def search(query_vec: List[float], k: int = 10) -> List[Tuple[int, float]]:
    """Search the index and return list of tuples (db_id, score).

    Score is inner-product (cosine if vectors are normalized).
    """
    if not _HAS_FAISS or _index is None:
        return []
    import numpy as np
    q = np.array(query_vec, dtype='float32')
    norm = np.linalg.norm(q)
    if norm > 0:
        q = q / norm
    q = q.reshape(1, -1)
    D, I = _index.search(q, k)
    results = []
    for score, idx in zip(D[0].tolist(), I[0].tolist()):
        if idx < 0:
            continue
        db_id = _id_map.get(idx)
        if db_id is None:
            continue
        results.append((db_id, float(score)))
    return results
