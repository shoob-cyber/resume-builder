# ATS Analyzer Microservice

This is a small FastAPI microservice that extracts text from uploaded resumes (PDF/DOCX), extracts keywords from a provided Job Description (JD), computes an ATS compatibility score, and returns suggestions for improvement.

## Quick start

1. Create and activate a Python virtual environment (recommended).

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Download NLTK corpora (the service will attempt to download on first run automatically).

4. Start the service:

```powershell
python main.py
# or
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

5. The Express backend proxies requests to this microservice at `/api/analyze` (ensure it is running on `http://127.0.0.1:8001`).

## API

POST /api/analyze
- form-data fields:
  - `resume`: file (PDF or DOCX)
  - `jd`: text (job description)

Response JSON contains `atsScore`, `keywordMatch`, `missingKeywords`, `suggestions`, and some diagnostics.
