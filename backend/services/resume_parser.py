"""Resume parsing utilities: extract text from bytes and extract skills via LLM."""
import io
import re
import json
import asyncio
from typing import Dict
from concurrent.futures import ThreadPoolExecutor

import pdfplumber
import openai

_executor = ThreadPoolExecutor(max_workers=1)


async def parse_resume_bytes(data: bytes, filename: str = "resume") -> Dict:
    text = None
    if data[:4] == b"%PDF":
        try:
            with pdfplumber.open(io.BytesIO(data)) as pdf:
                pages = [p.extract_text() or "" for p in pdf.pages]
                text = "\n".join(pages)
        except Exception:
            text = data.decode(errors="ignore")
    else:
        text = data.decode(errors="ignore")
    return await parse_resume_text(text)


async def parse_resume_text(text: str) -> Dict:
    """Extract skills using a small LLM prompt. Returns {'text': text, 'skills': [...]}

    The LLM call is wrapped in a thread executor to avoid blocking.
    """
    # quick heuristic candidates
    candidates = set(re.findall(r"\b[A-Z][a-zA-Z+#\.]{1,30}\b", text))

    def _call_llm(t: str):
        try:
            api_key = os.environ.get("OPENAI_API_KEY")
            if not api_key:
                return list(candidates)[:25]
            # prefer chat completion
            prompt = (
                "Extract a JSON array called skills from the following resume text. Only output JSON.\nText:\n" + t[:8000]
            )
            resp = openai.ChatCompletion.create(
                model=os.environ.get("OPENAI_CHAT_MODEL", "gpt-3.5-turbo"),
                messages=[{"role": "user", "content": prompt}],
                temperature=0,
            )
            content = resp["choices"][0]["message"]["content"]
            try:
                skills = json.loads(content)
                if isinstance(skills, list):
                    return skills
            except Exception:
                return list(candidates)[:25]
        except Exception:
            return list(candidates)[:25]

    loop = asyncio.get_running_loop()
    skills = await loop.run_in_executor(_executor, lambda: _call_llm(text))
    return {"text": text, "skills": skills}
