"""empty message

Revision ID: 0b953b680861
Revises: 58fb9ecf9920
Create Date: 2021-05-25 11:15:44.376882

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0b953b680861'
down_revision = '58fb9ecf9920'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('todolist', sa.Column(
        'completed', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('todolist', 'completed')
    # ### end Alembic commands ###