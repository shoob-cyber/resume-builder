"""add embedding column to resumes

Revision ID: 0002_add_embedding
Revises: 0001_create_tables
Create Date: 2025-11-17
"""
from alembic import op
import sqlalchemy as sa

revision = '0002_add_embedding'
down_revision = '0001_create_tables'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('resumes', sa.Column('embedding_json', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('resumes', 'embedding_json')
