from fastapi import APIRouter, HTTPException, Depends
from schemas import MatchRequest, MatchResponse
from services import embedding_service, matcher
from services import ats_scoring
from db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sql_models import Resume as ResumeModel, JobDescription as JobModel
from sqlalchemy import select
import json

router = APIRouter()


@router.post("/match", response_model=MatchResponse)
async def match_endpoint(req: MatchRequest, db: AsyncSession = Depends(get_db)):
    try:
        emb_resume = await embedding_service.embed_text(req.resume_text)
        emb_job = await embedding_service.embed_text(req.job_description)
        score = matcher.cosine_similarity(emb_resume, emb_job)
        return MatchResponse(score=score, details={"method": "openai-embeddings+langchain"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/score")
async def score_endpoint(req: MatchRequest):
    """Return ATS-style analysis (keywords, sections, readability, suggestions)."""
    try:
        resp = ats_scoring.analyze_resume_vs_jd(req.resume_text, req.job_description)
        return resp
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/match_ids", response_model=MatchResponse)
async def match_ids(resume_id: int, job_id: int, db: AsyncSession = Depends(get_db)):
    """Match stored resume and job by IDs using stored embeddings."""
    try:
        q = await db.execute(select(ResumeModel).where(ResumeModel.id == resume_id))
        resume = q.scalars().first()
        q2 = await db.execute(select(JobModel).where(JobModel.id == job_id))
        job = q2.scalars().first()
        if not resume or not job:
            raise HTTPException(status_code=404, detail="resume or job not found")
        # parse embeddings from JSON if available, otherwise compute
        try:
            emb_resume = embedding_service.json_to_embedding(resume.embedding_json) if getattr(resume, 'embedding_json', None) else await embedding_service.embed_text(resume.text)
            emb_job = embedding_service.json_to_embedding(job.embedding_json) if getattr(job, 'embedding_json', None) else await embedding_service.embed_text(job.text)
        except Exception:
            emb_resume = await embedding_service.embed_text(resume.text)
            emb_job = await embedding_service.embed_text(job.text)
        score = matcher.cosine_similarity(emb_resume, emb_job)
        return MatchResponse(score=score, details={"method": "db-embeddings+cosine"})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
