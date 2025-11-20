"""Trainer for a simple reranker using labelled resume-job pairs.

This module is a lightweight scaffold: it collects labeled pairs from the DB,
computes simple features (cosine similarity and keyword match via ats_scoring),
and trains a LightGBM model if the package is available. The trained model is
saved as `backend/models/reranker.pkl` using joblib.

Run `python -m backend.services.trainer train` or import and call `train()`.
"""
import os
from typing import List
import joblib

try:
    import lightgbm as lgb
    _HAS_LGB = True
except Exception:
    lgb = None
    _HAS_LGB = False

from services import embedding_service, matcher, ats_scoring
from sql_models import Label, Resume, JobDescription
from db import get_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'reranker.pkl')


async def _gather_examples(async_session):
    # runs in async context: gather labelled pairs and compute features
    examples = []
    async with async_session() as session:
        q = await session.execute(select(Label))
        labels = q.scalars().all()
        for lab in labels:
            # load resume and job
            q1 = await session.execute(select(Resume).where(Resume.id == lab.resume_id))
            r = q1.scalars().first()
            q2 = await session.execute(select(JobDescription).where(JobDescription.id == lab.job_id))
            j = q2.scalars().first()
            if not r or not j:
                continue
            # compute features
            emb_r = embedding_service.json_to_embedding(r.embedding_json) if r.embedding_json else await embedding_service.embed_text(r.text)
            emb_j = embedding_service.json_to_embedding(j.embedding_json) if j.embedding_json else await embedding_service.embed_text(j.text)
            sim = matcher.cosine_similarity(emb_r, emb_j)
            # simple keyword match via ats_scoring
            a = ats_scoring.analyze_resume_vs_jd(r.text, j.text)
            km = a.get('keywordMatch', 0)
            examples.append((sim, km, lab.label))
    return examples


def train_sync(examples: List):
    # train a simple LightGBM model on features
    if not _HAS_LGB:
        raise RuntimeError("lightgbm not installed")
    X = np.array([[e[0], e[1]] for e in examples], dtype=float)
    y = np.array([e[2] for e in examples], dtype=int)
    lgb_train = lgb.Dataset(X, label=y)
    params = {"objective": "binary", "metric": "auc"}
    bst = lgb.train(params, lgb_train, num_boost_round=50)
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(bst, MODEL_PATH)
    return MODEL_PATH


async def train(async_session):
    examples = await _gather_examples(async_session)
    if not examples:
        raise RuntimeError("no labelled examples found")
    return train_sync(examples)
