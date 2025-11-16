"""create tables

Revision ID: 0001_create_tables
Revises: 
Create Date: 2025-11-16
"""
from alembic import op
import sqlalchemy as sa

revision = '0001_create_tables'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'resumes',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
    )

    op.create_table(
        'skills',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False, unique=True),
    )

    op.create_table(
        'resume_skills',
        sa.Column('resume_id', sa.Integer(), sa.ForeignKey('resumes.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('skill_id', sa.Integer(), sa.ForeignKey('skills.id', ondelete='CASCADE'), primary_key=True),
    )

    op.create_table(
        'job_descriptions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
    )

def downgrade():
    op.drop_table('job_descriptions')
    op.drop_table('resume_skills')
    op.drop_table('skills')
    op.drop_table('resumes')
