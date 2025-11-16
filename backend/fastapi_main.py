
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import resume, ats
from api import job

app = FastAPI(title="Resume Builder - FastAPI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(ats.router, prefix="/ats", tags=["ats"])
app.include_router(job.router, prefix="/job", tags=["job"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "resume-builder-fastapi"}
