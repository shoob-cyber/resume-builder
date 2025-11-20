"""
Embedding helpers using LangChain/OpenAI embeddings.
Uses thread executor to avoid blocking the async loop.
"""
import os
import json
import asyncio
from typing import List
from concurrent.futures import ThreadPoolExecutor
from collections import OrderedDict
import hashlib

import openai

_executor = ThreadPoolExecutor(max_workers=2)

# prefer env var or default model
_EMBED_MODEL = os.environ.get("OPENAI_EMBED_MODEL", "text-embedding-3-large")
# simple in-memory LRU cache for embeddings to avoid repeated API calls
# key: sha256(model + '::' + normalized_text) -> List[float]
_EMBED_CACHE_SIZE = int(os.environ.get("EMBED_CACHE_SIZE", "1024"))
_embed_cache = OrderedDict()
_cache_lock = asyncio.Lock()


async def embed_text(text: str) -> List[float]:
    """Return embedding vector for the provided text using OpenAI's embeddings API.

    Runs the blocking openai call in a thread executor so it can be awaited from async code.
    Adds a small in-memory LRU cache to avoid duplicate calls for identical texts.
    """
    # normalize key
    key_src = (_EMBED_MODEL + "::" + (text or '')).encode('utf-8')
    key = hashlib.sha256(key_src).hexdigest()

    # check cache
    async with _cache_lock:
        if key in _embed_cache:
            # move to end (most recently used)
            vec = _embed_cache.pop(key)
            _embed_cache[key] = vec
            return vec

    def _call():
        resp = openai.Embedding.create(model=_EMBED_MODEL, input=text)
        return resp["data"][0]["embedding"]

    loop = asyncio.get_running_loop()
    vec = await loop.run_in_executor(_executor, _call)

    # persist in cache
    async with _cache_lock:
        if key in _embed_cache:
            # another coroutine raced and added it
            return _embed_cache[key]
        _embed_cache[key] = vec
        # evict oldest if over capacity
        if len(_embed_cache) > _EMBED_CACHE_SIZE:
            _embed_cache.popitem(last=False)

    return vec


def embedding_to_json(vec: List[float]) -> str:
    return json.dumps(vec)


def json_to_embedding(s: str) -> List[float]:
    return json.loads(s)
