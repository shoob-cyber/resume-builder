from sqlalchemy import Column, Integer, String, Text, Table, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# Optionally add a pgvector Vector column when pgvector is installed and
# the application is using Postgres. If pgvector is not available we fall
# back to storing embeddings as JSON in `embedding_json` which works with
# SQLite and other DB backends used for development.
try:
    from pgvector.sqlalchemy import Vector
    _HAS_PGVECTOR = True
except Exception:
    Vector = None  # type: ignore
    _HAS_PGVECTOR = False

resume_skills = Table(
    "resume_skills",
    Base.metadata,
    Column("resume_id", Integer, ForeignKey("resumes.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    text = Column(Text, nullable=False)
    skills = relationship("Skill", secondary=resume_skills, back_populates="resumes")
    # store embedding as JSON text (for Postgres prefer pgvector)
    embedding_json = Column(Text, nullable=True)
    if _HAS_PGVECTOR:
        # optional pgvector column (vector type) for fast ANN in Postgres
        embedding_vector = Column(Vector, nullable=True)


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), unique=True, nullable=False)
    resumes = relationship("Resume", secondary=resume_skills, back_populates="skills")


class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    text = Column(Text, nullable=False)
    # optionally store job embedding as JSON and a pgvector column when available
    embedding_json = Column(Text, nullable=True)
    if _HAS_PGVECTOR:
        embedding_vector = Column(Vector, nullable=True)


class Label(Base):
    __tablename__ = "labels"
    id = Column(Integer, primary_key=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    # label: 1 accepted/good, 0 rejected/bad (simple binary)
    label = Column(Integer, nullable=False)
    created_at = Column(String(64), nullable=True)
