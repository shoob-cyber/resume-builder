import math
from services.matcher import cosine_similarity


def test_cosine_similarity_identical():
    a = [1.0, 0.0, 0.0]
    b = [1.0, 0.0, 0.0]
    assert math.isclose(cosine_similarity(a, b), 1.0, rel_tol=1e-6)


def test_cosine_similarity_orthogonal():
    a = [1.0, 0.0]
    b = [0.0, 1.0]
    assert math.isclose(cosine_similarity(a, b), 0.0, abs_tol=1e-6)


def test_cosine_similarity_zero_vector():
    a = [0.0, 0.0]
    b = [1.0, 2.0]
    assert cosine_similarity(a, b) == 0.0
