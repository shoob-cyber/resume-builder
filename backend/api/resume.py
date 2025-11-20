from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
import json

from db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sql_models import Resume as ResumeModel, Skill as SkillModel
from sqlalchemy import select
from services import resume_parser, embedding_service
from services import faiss_index
from sql_models import _HAS_PGVECTOR
from schemas import ResumeRead, ResumeCreate

router = APIRouter()


@router.post("/upload", response_model=ResumeRead)
async def upload_resume(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    content = await file.read()
    parsed = await resume_parser.parse_resume_bytes(content, filename=file.filename)
    skills = parsed.get("skills", []) or []

    resume_obj = ResumeModel(filename=file.filename, text=parsed["text"]) 
    db.add(resume_obj)
    await db.flush()

    # persist skills
    skill_objs = []
    for s in skills:
        name = s.strip()
        if not name:
            continue
        q = await db.execute(select(SkillModel).where(SkillModel.name == name))
        existing = q.scalars().first()
        if existing:
            skill_objs.append(existing)
        else:
            new_skill = SkillModel(name=name)
            db.add(new_skill)
            await db.flush()
            skill_objs.append(new_skill)

    resume_obj.skills = skill_objs

    # embeddings
    emb = await embedding_service.embed_text(parsed["text"])
    resume_obj.embedding_json = embedding_service.embedding_to_json(emb)
    # if pgvector is enabled in models, store vector directly as well
    try:
        if _HAS_PGVECTOR and hasattr(resume_obj, 'embedding_vector'):
            resume_obj.embedding_vector = emb
    except Exception:
        # ignore if assignment isn't supported in current DB
        pass
    # index into FAISS in-memory index (optional)
    try:
        faiss_index.index_resume(resume_obj.id, emb)
    except Exception:
        # no-op if FAISS not installed or indexing fails
        pass

    await db.commit()
    await db.refresh(resume_obj)

    return ResumeRead(id=resume_obj.id, filename=resume_obj.filename, text=resume_obj.text, skills=[s.name for s in resume_obj.skills])


@router.post("/analyze", response_model=ResumeRead)
async def analyze_resume(payload: ResumeCreate, db: AsyncSession = Depends(get_db)):
    if not payload.text:
        raise HTTPException(status_code=400, detail="text required")
    parsed = await resume_parser.parse_resume_text(payload.text)
    skills = parsed.get("skills", []) or payload.skills or []

    resume_obj = ResumeModel(filename=payload.filename or "inline", text=parsed["text"]) 
    db.add(resume_obj)
    await db.flush()

    skill_objs = []
    for s in skills:
        name = s.strip()
        if not name:
            continue
        q = await db.execute(select(SkillModel).where(SkillModel.name == name))
        existing = q.scalars().first()
        if existing:
            skill_objs.append(existing)
        else:
            new_skill = SkillModel(name=name)
            db.add(new_skill)
            await db.flush()
            skill_objs.append(new_skill)

    resume_obj.skills = skill_objs
    emb = await embedding_service.embed_text(parsed["text"])
    resume_obj.embedding_json = embedding_service.embedding_to_json(emb)

    await db.commit()
    await db.refresh(resume_obj)

    return ResumeRead(id=resume_obj.id, filename=resume_obj.filename, text=resume_obj.text, skills=[s.name for s in resume_obj.skills])


@router.get("/list", response_model=List[ResumeRead])
async def list_resumes(db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(ResumeModel))
    results = q.scalars().all()
    out = []
    for r in results:
        out.append(ResumeRead(id=r.id, filename=r.filename, text=r.text, skills=[s.name for s in r.skills]))
    return out
