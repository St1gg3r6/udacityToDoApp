"""empty message

Revision ID: ec0947450be7
Revises: 0e5ab6d3947b
Create Date: 2021-05-24 16:53:52.324405

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ec0947450be7'
down_revision = '0e5ab6d3947b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('todolist',
                    sa.Column('todolistid', sa.Integer(), nullable=False),
                    sa.Column('name', sa.String(), nullable=False),
                    sa.PrimaryKeyConstraint('todolistid')
                    )
    op.add_column('todos', sa.Column(
        'todolistid', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'todos', 'todolist', [
                          'todolistid'], ['todolistid'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'todos', type_='foreignkey')
    op.drop_column('todos', 'todolistid')
    op.drop_table('todolist')
    # ### end Alembic commands ###
