from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import uvicorn
import tempfile
import os
import shutil
import re
from collections import Counter

try:
    # PDF extraction
    from pdfminer.high_level import extract_text
except Exception:
    extract_text = None

try:
    import docx2txt
except Exception:
    docx2txt = None

# NLP & readability
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

app = FastAPI(title="ATS Analyzer Service")

# helper: save upload to temp file and return path
def _save_upload_to_tmp(upload_file: UploadFile):
    suffix = os.path.splitext(upload_file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(upload_file.file, tmp)
        return tmp.name


def _extract_text_from_file(path: str, filename: str) -> str:
    lower = filename.lower()
    text = ""
    try:
        if lower.endswith('.pdf') and extract_text:
            text = extract_text(path)
        elif (lower.endswith('.docx') or lower.endswith('.doc')) and docx2txt:
            text = docx2txt.process(path)
        else:
            # fallback: try reading as binary and decode
            with open(path, 'rb') as f:
                raw = f.read()
                try:
                    text = raw.decode('utf-8')
                except Exception:
                    try:
                        text = raw.decode('latin-1')
                    except Exception:
                        text = ''
    except Exception as e:
        print('Error extracting file text:', e)
        text = ''
    return text or ''


def _prepare_nlp():
    # download small NLTK datasets if not already present
    if nltk:
        try:
            stopwords.words('english')
        except Exception:
            nltk.download('punkt')
            nltk.download('stopwords')
            nltk.download('averaged_perceptron_tagger')
            nltk.download('wordnet')


def _extract_keywords_from_text(text: str, top_n: int = 30):
    # If NLTK isn't available, or required corpora are missing, fall back to a simple regex-based extractor.
    if not nltk:
        tokens = re.findall(r"\b[a-zA-Z0-9+-#\.]+\b", text.lower())
        counter = Counter([t for t in tokens if len(t) > 2])
        return [k for k, _ in counter.most_common(top_n)]

    # Try a quick pre-check to see if NLTK corpora are present and usable.
    try:
        # ensure required corpora are available
        _ = stopwords.words('english')
        _ = word_tokenize("test")
        _ = WordNetLemmatizer()
        # If above succeeded, perform full NLTK-based extraction.
        lemmatizer = WordNetLemmatizer()
        tokens = word_tokenize(text.lower())
        words = [w for w in tokens if w.isalpha()]
        stop = set(stopwords.words('english'))
        filtered = [lemmatizer.lemmatize(w) for w in words if w not in stop and len(w) > 2]
        counter = Counter(filtered)
        return [k for k, _ in counter.most_common(top_n)]
    except Exception as e:
        # Any failure (missing corpora, SSL, etc.) - log and fallback to regex extractor.
        print('NLTK unavailable or failed during processing, falling back to simple extractor:', e)

    # Fallback extractor (simple, robust)
    tokens = re.findall(r"\b[a-zA-Z0-9+\-#\.]+\b", text.lower())
    counter = Counter([t for t in tokens if len(t) > 2])
    return [k for k, _ in counter.most_common(top_n)]


def _detect_sections(text: str):
    sections = ['education', 'experience', 'skills', 'projects', 'certifications', 'summary', 'work experience']
    present = []
    lower = text.lower()
    for s in sections:
        # look for heading-like occurrence
        pattern = r"(^|\n)\s*" + re.escape(s) + r"\b"
        if re.search(pattern, lower):
            present.append(s)
    return present


@app.post('/api/analyze')
async def analyze(resume: UploadFile = File(None), jd: str = Form('')):
    """Accepts a resume file upload and a job description text and returns ATS analysis JSON."""
    try:
        _prepare_nlp()

        resume_text = ''
        if resume is not None:
            tmp_path = _save_upload_to_tmp(resume)
            try:
                resume_text = _extract_text_from_file(tmp_path, resume.filename)
            finally:
                try:
                    os.unlink(tmp_path)
                except Exception:
                    pass
        else:
            resume_text = ''

        jd_text = (jd or '').strip()

        # If JD is empty, return an informative error
        if not jd_text:
            return JSONResponse(status_code=400, content={'error': 'Please provide a job description (jd) as form-field.'})

        # Extract keywords from JD
        jd_keywords = _extract_keywords_from_text(jd_text, top_n=30)

        # Match keywords
        resume_lower = (resume_text or '').lower()
        matched = []
        missing = []
        for kw in jd_keywords:
            if kw.lower() and kw.lower() in resume_lower:
                matched.append(kw)
            else:
                missing.append(kw)

        keyword_match_pct = 0
        if jd_keywords:
            keyword_match_pct = int(round((len(matched) / len(jd_keywords)) * 100))

        # Sections
        present_sections = _detect_sections(resume_text)
        total_sections = 6
        sections_score = int(round((len(present_sections) / total_sections) * 100))

        # Readability
        flesch = None
        if textstat and resume_text and len(resume_text.split()) > 50:
            try:
                flesch = textstat.flesch_reading_ease(resume_text)
            except Exception:
                flesch = None
        # Normalize flesch to 0-100 scale
        if flesch is None:
            readability_score = 50
        else:
            readability_score = max(0, min(100, int(round(flesch))))

        # Compute ATS score with weights
        ats_score = int(round(0.6 * keyword_match_pct + 0.25 * sections_score + 0.15 * readability_score))
        ats_score = max(0, min(100, ats_score))

        # suggestions
        suggestions = []
        if missing:
            suggestions.append('Include keywords like: ' + ', '.join(missing[:6]) + (', ...' if len(missing) > 6 else '.'))
        if not resume_text:
            suggestions.append('No resume text extracted. Make sure the file is a valid PDF or DOCX and not password-protected or image-only.')
        if len(present_sections) < 3:
            suggestions.append('Ensure standard resume sections are present (Education, Experience, Skills).')

        # Try to detect tables/columns by many short lines or pipes/tabs
        lines = resume_text.splitlines()
        short_line_fraction = sum(1 for l in lines if len(l.strip()) <= 30) / max(1, len(lines))
        if short_line_fraction > 0.45:
            suggestions.append('Avoid using tables, multiple columns, or heavy use of short tabular lines; prefer simple linear layouts.')

        suggestions.append('Use consistent section headings (e.g., "Experience", "Education", "Skills").')

        resp = {
            'atsScore': ats_score,
            'keywordMatch': keyword_match_pct,
            'missingKeywords': missing[:20],
            'presentSections': present_sections,
            'readability': readability_score,
            'suggestions': suggestions
        }

        return resp
    except Exception as e:
        print('Server error in analyze:', e)
        return JSONResponse(status_code=500, content={'error': 'Internal server error', 'detail': str(e)})


if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8001, reload=True)
