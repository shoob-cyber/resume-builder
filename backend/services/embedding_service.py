"""
Embedding helpers using LangChain/OpenAI embeddings.
Uses thread executor to avoid blocking the async loop.
"""
import os
import json
import asyncio
from typing import List
from concurrent.futures import ThreadPoolExecutor

from langchain.embeddings import OpenAIEmbeddings

_executor = ThreadPoolExecutor(max_workers=2)

# initialize LangChain embeddings with model name
_emb = OpenAIEmbeddings(model="text-embedding-3-large")


async def embed_text(text: str) -> List[float]:
    """Return embedding vector for the provided text.

    LangChain's embedding call is synchronous; run in threadpool.
    """
    loop = asyncio.get_running_loop()
    vec = await loop.run_in_executor(_executor, lambda: _emb.embed_query(text))
    return vec


def embedding_to_json(vec: List[float]) -> str:
    return json.dumps(vec)


def json_to_embedding(s: str) -> List[float]:
    return json.loads(s)
