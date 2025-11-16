from pydantic import BaseModel
from typing import List, Optional


class ResumeCreate(BaseModel):
    filename: Optional[str] = None
    text: str
    skills: Optional[List[str]] = []


class ResumeRead(BaseModel):
    id: int
    filename: str
    text: str
    skills: Optional[List[str]] = []


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


class MatchResponse(BaseModel):
    score: float
    details: Optional[dict] = None
