from logging import error
from typing import final
from flask import Flask, render_template, request, url_for, redirect, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://stephenusher@localhost:5432/todoapp'
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class TodoList(db.Model):
    __tablename__ = 'todolist'
    todolistid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    todos = db.relationship('Todo', backref='list', lazy=True)

    def __repr__(self):
        return f'<Todolist {self.todolistid} {self.name} >'


class Todo(db.Model):
    __tablename__ = 'todos'
    todoid = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    todolistid = db.Column(db.Integer, db.ForeignKey(
        'todolist.todolistid'), nullable=False)

    def __repr__(self):
        return f'<Todo {self.todoid} {self.description} >'


@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    try:
        newdescription = request.form.get('description', '')
        newtodo = Todo(description=newdescription)
        db.session.add(newtodo)
        db.session.commit()
    except:
        error = True
        db.session.rollback()
    finally:
        db.session.close()
    if not error:
        # The url_for argument is the function name that returns the page to load.
        return redirect(url_for('index'))


@app.route('/todos/create_a', methods=['POST'])
def create_todo_a():
    error = False
    # Create an empty dictionary to send json object back to the client
    data = {}
    try:
        newdescription = request.get_json()['description']
        selectedList = request.get_json()['todolistid']
        newtodo = Todo(description=newdescription, todolistid=selectedList)
        db.session.add(newtodo)
        db.session.commit()
        # Add the data to the dictionary to be sent back
        data['todoid'] = newtodo.todoid
        data['description'] = newtodo.description
        data['todolistid'] = newtodo.todolistid
    except:
        error = True
        db.session.rollback()
    finally:
        db.session.close()
    if error:
        # Stop the request so that it doesn't expect a result
        abort(400)
    else:
        # Send the response back to the client with the json object to be processed in the js function
        return jsonify(data)


@app.route('/lists/create', methods=['POST'])
def createNewList():
    error = False
    try:
        newListName = request.form.get('listdescription', '')
        newList = TodoList(name=newListName)
        db.session.add(newList)
        db.session.commit()
    except:
        error = True
        db.session.rollback()
    finally:
        addedListID = newList.todolistid
        db.session.close()
    if not error:
        return redirect(url_for('gettodos', listid=addedListID))


@app.route('/lists/<listid>/completeList', methods=['POST'])
def completeList(listid):
    print('In the completeList function, listid: ', listid)
    try:
        completeStatus = request.get_json()['completed']
        print('completeStatus:', completeStatus)
        todoList = TodoList.query.get(listid)
        print('todoList: ', todoList)
        todos = Todo.query.filter_by(todolistid=listid).all()
        print('todos: ', todos)
        todoList.completed = completeStatus
        for todo in todos:
            todo.completed = completeStatus
        db.session.commit()
    except:
        db.session.rollback
        print(sys.exc_info())
    finally:
        db.session.close()
    return redirect(url_for('gettodos', listid=listid))


@ app.route('/todos/<todoid>/updateCompStatus', methods=['POST'])
def updateTodoCompStatus(todoid):
    try:
        completeStatus = request.get_json()['completed']
        todoItem = Todo.query.get(todoid)
        print('todoItem: ', todoItem)
        todoItem.completed = completeStatus
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    # return redirect(url_for('index'))
    return 'Record Updated'


@app.route('/lists/<listid>/deleteList', methods=['DELETE'])
def deleteList(listid):
    try:
        print("TRYING TO DELETE LIST")
        todoItems = Todo.query.filter_by(todolistid=listid).all()
        for todoItem in todoItems:
            db.session.delete(todoItem)

        listItem = TodoList.query.get(listid)
        db.session.delete(listItem)

        db.session.commit()
        print('GOT TO LINE AFTER COMMIT')
    except:
        db.session.rollback()
        print('ROLLED BACK SESSION IN DELETE LIST PROCESS')
    finally:
        db.session.close()
    # return redirect(url_for('gettodos', listid=listid))
    return 'List deleted'


@ app.route('/todos/<todoid>/deleteTodo', methods=['DELETE'])
def deleteTodo(todoid):
    print('todoid = ', todoid)
    try:
        todoitem = Todo.query.get(todoid)
        db.session.delete(todoitem)
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return 'Record Deleted'


# @app.route('/')  # Initial index function before the parent lists was created
# def index():
#     # 'data' is the variable to pass to the HTML template
#     # which contains the data that needs to be processed
#     # by the jinja code in the HTML file.
#     return render_template('index.html', data=Todo.query.order_by('todoid').all())


# Index function now that the parent list model has been implemented
@ app.route('/lists/<listid>')
def gettodos(listid):
    print('RUNNING gettodos with listid:', listid)
    return render_template('index.html',
                           list=TodoList.query.order_by('todolistid').all(),
                           data=Todo.query.filter_by(
                               todolistid=listid).order_by('todoid').all(),
                           selected=listid)


@ app.route('/')
def index():
    # New index function redirects to the gettodos function with default list 1 selected
    return redirect(url_for('gettodos', listid=1))


if __name__ == '__main__':
    app.run(debug=True)
