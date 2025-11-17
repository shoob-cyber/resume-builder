import re
import os
from collections import Counter
from typing import List, Dict

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    from nltk.stem import WordNetLemmatizer
except Exception:
    nltk = None

try:
    import textstat
except Exception:
    textstat = None


def _extract_keywords_from_text(text: str, top_n: int = 30) -> List[str]:
    if not nltk:
        tokens = re.findall(r"\b[a-zA-Z0-9+-#\.]+\b", text.lower())
        counter = Counter([t for t in tokens if len(t) > 2])
        return [k for k, _ in counter.most_common(top_n)]

    try:
        _ = stopwords.words('english')
        _ = word_tokenize('test')
        lemmatizer = WordNetLemmatizer()
        tokens = word_tokenize(text.lower())
        words = [w for w in tokens if w.isalpha()]
        stop = set(stopwords.words('english'))
        filtered = [lemmatizer.lemmatize(w) for w in words if w not in stop and len(w) > 2]
        counter = Counter(filtered)
        return [k for k, _ in counter.most_common(top_n)]
    except Exception:
        tokens = re.findall(r"\b[a-zA-Z0-9+\-#\.]+\b", text.lower())
        counter = Counter([t for t in tokens if len(t) > 2])
        return [k for k, _ in counter.most_common(top_n)]


def _detect_sections(text: str) -> List[str]:
    sections = ['education', 'experience', 'skills', 'projects', 'certifications', 'summary', 'work experience']
    present = []
    lower = text.lower()
    for s in sections:
        pattern = r"(^|\n)\s*" + re.escape(s) + r"\b"
        if re.search(pattern, lower):
            present.append(s)
    return present


def analyze_resume_vs_jd(resume_text: str, jd_text: str) -> Dict:
    resume_text = (resume_text or '')
    jd_text = (jd_text or '').strip()
    if not jd_text:
        raise ValueError('job description is required')

    jd_keywords = _extract_keywords_from_text(jd_text, top_n=30)

    resume_lower = resume_text.lower()
    matched = []
    missing = []
    for kw in jd_keywords:
        if kw and kw.lower() in resume_lower:
            matched.append(kw)
        else:
            missing.append(kw)

    keyword_match_pct = int(round((len(matched) / len(jd_keywords)) * 100)) if jd_keywords else 0

    present_sections = _detect_sections(resume_text)
    total_sections = 6
    sections_score = int(round((len(present_sections) / total_sections) * 100))

    flesch = None
    if textstat and resume_text and len(resume_text.split()) > 50:
        try:
            flesch = textstat.flesch_reading_ease(resume_text)
        except Exception:
            flesch = None

    readability_score = 50 if flesch is None else max(0, min(100, int(round(flesch))))

    ats_score = int(round(0.6 * keyword_match_pct + 0.25 * sections_score + 0.15 * readability_score))
    ats_score = max(0, min(100, ats_score))

    suggestions = []
    if missing:
        suggestions.append('Include keywords like: ' + ', '.join(missing[:6]) + (', ...' if len(missing) > 6 else '.'))
    if not resume_text:
        suggestions.append('No resume text extracted. Make sure the file is a valid PDF or DOCX and not password-protected or image-only.')
    if len(present_sections) < 3:
        suggestions.append('Ensure standard resume sections are present (Education, Experience, Skills).')

    lines = resume_text.splitlines()
    short_line_fraction = sum(1 for l in lines if len(l.strip()) <= 30) / max(1, len(lines))
    if short_line_fraction > 0.45:
        suggestions.append('Avoid using tables, multiple columns, or heavy use of short tabular lines; prefer simple linear layouts.')

    suggestions.append('Use consistent section headings (e.g., "Experience", "Education", "Skills").')

    return {
        'atsScore': ats_score,
        'keywordMatch': keyword_match_pct,
        'missingKeywords': missing[:20],
        'presentSections': present_sections,
        'readability': readability_score,
        'suggestions': suggestions,
    }
