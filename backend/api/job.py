from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas import ResumeCreate
from db import get_db
from sql_models import JobDescription as JobModel
from services import embedding_service
from pydantic import BaseModel
from sql_models import _HAS_PGVECTOR
from services import faiss_index

router = APIRouter()


class JobCreate(BaseModel):
    title: str
    text: str


class JobRead(BaseModel):
    id: int
    title: str
    text: str


@router.post("/create", response_model=JobRead)
async def create_job(payload: JobCreate, db: AsyncSession = Depends(get_db)):
    job = JobModel(title=payload.title, text=payload.text)
    db.add(job)
    await db.flush()
    # generate and persist embedding as JSON in this example (if column added)
    emb = await embedding_service.embed_text(payload.text)
    # store embedding as JSON in a new column 'embedding_json' if exists
    try:
        job.embedding_json = embedding_service.embedding_to_json(emb)
        if _HAS_PGVECTOR and hasattr(job, 'embedding_vector'):
            job.embedding_vector = emb
    except Exception:
        pass
    # optionally index job text into FAISS as well (may be useful for hybrid search)
    try:
        faiss_index.index_resume(job.id, emb)
    except Exception:
        pass
    await db.commit()
    await db.refresh(job)
    return JobRead(id=job.id, title=job.title, text=job.text)


@router.get("/list", response_model=list[JobRead])
async def list_jobs(db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(JobModel))
    results = q.scalars().all()
    return [JobRead(id=j.id, title=j.title, text=j.text) for j in results]
