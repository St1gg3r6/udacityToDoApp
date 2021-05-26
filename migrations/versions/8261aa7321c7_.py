"""empty message

Revision ID: 8261aa7321c7
Revises: 0b953b680861
Create Date: 2021-05-25 11:17:54.358556

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8261aa7321c7'
down_revision = '0b953b680861'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todolist', 'completed',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('todolist', 'completed',
               existing_type=sa.BOOLEAN(),
               nullable=True)
    # ### end Alembic commands ###
