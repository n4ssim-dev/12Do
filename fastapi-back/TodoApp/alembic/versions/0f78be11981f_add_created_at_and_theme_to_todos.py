"""add created_at and theme to todos

Revision ID: 0f78be11981f
Revises: 
Create Date: 2026-01-22 10:40:54.430367

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0f78be11981f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('todos', sa.Column('created_at', sa.DateTime(), nullable=True, default=datetime.utcnow))
    op.add_column('todos', sa.Column('theme', sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column('todos', 'theme')
    op.drop_column('todos', 'created_at')
