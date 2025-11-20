"""Resume parsing utilities: extract text from bytes and extract skills.

This module prefers a local spaCy NER/noun-chunk extraction when available
for deterministic, fast extraction. If spaCy is not installed, it falls back
to an LLM-based extraction (OpenAI) if `OPENAI_API_KEY` is set, otherwise a
simple regex heuristic is returned.
"""
import io
import re
import os
import json
import asyncio
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor

import pdfplumber

_executor = ThreadPoolExecutor(max_workers=1)


def _spacy_extract(text: str) -> List[str]:
    try:
        import spacy
        # try common small model; user may need to `python -m spacy download en_core_web_sm`
        try:
            nlp = spacy.load("en_core_web_sm")
        except Exception:
            nlp = spacy.load("en_core_web_sm", exclude=["tok2vec"]) if "en_core_web_sm" in spacy.util.get_installed_models() else None
        if not nlp:
            return []
        doc = nlp(text[:20000])
        candidates = set()
        # use named entities and noun chunks as candidate skills
        for ent in doc.ents:
            if ent.label_ in {"ORG", "PRODUCT", "LANGUAGE", "WORK_OF_ART", "NORP", "TECH"} or len(ent.text) <= 40:
                candidates.add(ent.text.strip())
        for chunk in doc.noun_chunks:
            t = chunk.text.strip()
            if 2 <= len(t) <= 40:
                candidates.add(t)
        return list(candidates)
    except Exception:
        return []


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
    """Return {'text': text, 'skills': [...]}.

    Strategy:
    - Try spaCy extraction if available.
    - Else, if OPENAI_API_KEY present, call OpenAI ChatCompletion to extract JSON array.
    - Else fall back to regex heuristics.
    """
    # spaCy deterministic pass
    candidates = _spacy_extract(text)
    if candidates:
        return {"text": text, "skills": candidates}

    # quick heuristic candidates (fallback)
    regex_candidates = set(re.findall(r"\b[A-Z][a-zA-Z+#\.]{1,30}\b", text))

    def _call_llm(t: str):
        try:
            api_key = os.environ.get("OPENAI_API_KEY")
            if not api_key:
                return list(regex_candidates)[:25]
            import openai
            openai.api_key = api_key
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
                return list(regex_candidates)[:25]
        except Exception:
            return list(regex_candidates)[:25]

    loop = asyncio.get_running_loop()
    skills = await loop.run_in_executor(_executor, lambda: _call_llm(text))
    return {"text": text, "skills": skills}
