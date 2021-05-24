document.querySelector('#form_async').onsubmit = function(e) {
    // Prevent the browser from refreshing the page on submit
    e.preventDefault();
    // Send the request to the server, 
    // defining the method type, the body for the data to be sent
    // and headers to define how the data is being sent.
    fetch('/todos/create_a', {
        method: 'POST',
        body: JSON.stringify({
            'description': document.querySelector('#description_a').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // What to do when the response from the server has been received...
    .then(function(response) {
        return response.json();
    })
    // Process the json response received from the first 'then', ie need to update the DOM...
    .then(function(jsonResponse) {
        console.log(jsonResponse);
        // The unordered list for the todos
        const todoitems = document.querySelector('#todoitems');
        // Create a new list item for the new todo
        const todoitem = document.createElement('li');
        todoitem.className = 'todoitem';
        // Create a new completion checkbox for the new todo
        const todochkbx = document.createElement('input');
        // type="checkbox" name="complete" id="complete" data-id="{{ d.todoid }}"
        todochkbx.type = 'checkbox';
        todochkbx.name = 'complete';
        todochkbx.id = 'complete';
        todochkbx.className = 'check-completed';
        todochkbx.dataset['id'] = jsonResponse['todoid'];
        todochkbx.onchange = function(e) {
            chkCompleteAction(e)
        }
        // Add the text for the new todo to the list item
        todospan = document.createElement('span');
        todospan.className = 'todotext';
        todospan.innerHTML = jsonResponse['description'];
        // Add delete button for the new todo to the list item
        delbtn = document.createElement('button');
        // <button type="submit" id="delete-todo" class="delete-todo" data-id="{{ d.todoid }}">&cross;</button>
        delbtn.type = 'submit';
        delbtn.id = 'delete-todo';
        delbtn.className = 'delete-todo';
        delbtn.dataset['id'] = jsonResponse['todoid'];
        delbtn.innerHTML = '&cross;';
        delbtn.onclick = function(e) {
            deleteTodo(e)
        };
        // Append the new list item to the unordered list of todos
        todoitem.appendChild(todochkbx);
        todoitem.appendChild(todospan);
        todoitem.appendChild(delbtn);
        todoitems.appendChild(todoitem);
        // Clear text from the text box ready for a new entry
        document.querySelector('#description_a').value = '';
        document.querySelector('#error').className = 'hidden';
    })
    .catch(function() {
        document.querySelector('#error').className = '';
    })
}

// Assign the click action to all of the checkboxes and delete buttons
// Get all checkboxes and delete buttons into arrays
const chkCompletes = document.querySelectorAll('#complete');
const delTodos = document.querySelectorAll('#delete-todo');
// Loop through them to assign the function
for (let i = 0; i < chkCompletes.length; i++) {
    const chkComplete = chkCompletes[i];
    const delTodo = delTodos[i];
    chkComplete.onchange = function(e) {
        chkCompleteAction(e)
    }
    delTodo.onclick = function(e) {
        deleteTodo(e)
    }
}

function chkCompleteAction(e) {
    console.log('event', e);
    const compStatus = e.target.checked;
    const todoid = e.target.dataset['id'];
    fetch('todos/' + todoid + '/updateCompStatus', {
        method: 'POST',
        body: JSON.stringify({
            'completed': compStatus
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(){
        document.querySelector('#error').className = 'hidden';
    })
    .catch(function() {
        document.querySelector('#error').className = '';        
    })
}

function deleteTodo(e) {
    console.log('event', e);
    const todoid = e.target.dataset['id'];
    fetch('todos/' + todoid + '/deleteTodo', {
        method: 'DELETE',
    })
    .then(function() {
        const todoitem = e.target.parentElement;
        todoitem.remove();
        document.querySelector('#error').className = 'hidden';
    })
    .catch(function() {
        document.querySelector('#error').className = '';
    })
}