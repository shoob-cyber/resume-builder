"""add embedding_vector columns and labels table

Revision ID: 0003_add_embedding_vector_and_labels
Revises: 0002_add_embedding
Create Date: 2025-11-17 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003_add_embedding_vector_and_labels'
down_revision = '0002_add_embedding'
branch_labels = None
depends_on = None


def upgrade():
    # Add pgvector columns if using Postgres - vector type must be available
    conn = op.get_bind()
    dialect = conn.dialect.name
    if dialect == 'postgresql':
        # create columns of type vector (pgvector extension must be enabled)
        op.execute("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS embedding_vector vector")
        op.execute("ALTER TABLE job_descriptions ADD COLUMN IF NOT EXISTS embedding_vector vector")

    # Add labels table (portable across DBs)
    op.create_table(
        'labels',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('resume_id', sa.Integer, sa.ForeignKey('resumes.id', ondelete='CASCADE'), nullable=False),
        sa.Column('job_id', sa.Integer, sa.ForeignKey('job_descriptions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('label', sa.Integer, nullable=False),
        sa.Column('created_at', sa.String(64), nullable=True),
    )


def downgrade():
    conn = op.get_bind()
    dialect = conn.dialect.name
    if dialect == 'postgresql':
        op.execute("ALTER TABLE resumes DROP COLUMN IF EXISTS embedding_vector")
        op.execute("ALTER TABLE job_descriptions DROP COLUMN IF EXISTS embedding_vector")
    op.drop_table('labels')
