"""
Embedding helpers using LangChain/OpenAI embeddings.
Uses thread executor to avoid blocking the async loop.
"""
import os
import json
import asyncio
from typing import List
from concurrent.futures import ThreadPoolExecutor

import openai

_executor = ThreadPoolExecutor(max_workers=2)

# prefer env var or default model
_EMBED_MODEL = os.environ.get("OPENAI_EMBED_MODEL", "text-embedding-3-large")


async def embed_text(text: str) -> List[float]:
    """Return embedding vector for the provided text using OpenAI's embeddings API.

    Runs the blocking openai call in a thread executor so it can be awaited from async code.
    """
    def _call():
        resp = openai.Embedding.create(model=_EMBED_MODEL, input=text)
        # OpenAI returns a list of data items; take the first embedding
        return resp["data"][0]["embedding"]

    loop = asyncio.get_running_loop()
    vec = await loop.run_in_executor(_executor, _call)
    return vec


def embedding_to_json(vec: List[float]) -> str:
    return json.dumps(vec)


def json_to_embedding(s: str) -> List[float]:
    return json.loads(s)
