from flask import Flask, render_template, request, url_for, redirect, jsonify, abort
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://stephenusher@localhost:5432/todoapp'
db = SQLAlchemy(app)


class Todo(db.Model):
    __tablename__ = 'todos'
    todoid = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(), nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return f'<Todo {self.todoid} {self.description} >'


db.create_all()


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
        newtodo = Todo(description=newdescription)
        db.session.add(newtodo)
        db.session.commit()
        # Add the data to the dictionary to be sent back
        data['description'] = newtodo.description
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


@app.route('/')
def index():
    # 'data' is the variable to pass to the HTML template
    # which contains the data that needs to be processed
    # by the jinja code in the HTML file.
    return render_template('index.html', data=Todo.query.all())


if __name__ == '__main__':
    app.run(debug=True)
