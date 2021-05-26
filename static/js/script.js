syncSelectedList();
listsActionLoad();
todosActionLoad();
document.querySelector('#form_async').onsubmit = function(e) {
    createTodo(e);
}
console.log('RELOADING PAGE');

function createTodo(e) {
    e.preventDefault();
    const selectedList = document.querySelector('#selected').innerHTML;
    const description = document.querySelector('#description_a').value;
    const body = JSON.stringify({'description': description, 'todolistid': selectedList});
    fetch('/todos/create_a', {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();        
    })
    .then(function(jsonResponse) {
        const todoItemList = document.querySelector('#todoitems');
        const newTodoItem = createNewTodoItemElement(jsonResponse);
        todoItemList.appendChild(newTodoItem);
        document.querySelector('#description_a').value = '';
        document.querySelector('#error').className = 'hidden';
    })
    .catch(function() {
        document.querySelector('#error').className = '';
    })
}

function createNewTodoItemElement(jsonResponse) {
    const newTodoItem = document.createElement('li');
    const newTodoID = jsonResponse['todoid'];
    const newTodoDescription = jsonResponse['description'];
    newTodoItem.className = 'todoitem';
    const newTodoCheckbox = createNewToDoCheckbox(newTodoID);
    const newTodoSpan = createNewTodoDescription(newTodoDescription);
    const newTodoDeleteButton = createNewTodoDeleteButton(newTodoID);
    newTodoItem.appendChild(newTodoCheckbox);
    newTodoItem.appendChild(newTodoSpan);
    newTodoItem.appendChild(newTodoDeleteButton);
    return newTodoItem;
}

function createNewToDoCheckbox(todoid){
    const newTodoCheckbox = document.createElement('input');
    newTodoCheckbox.type = 'checkbox';
    newTodoCheckbox.name = 'complete';
    newTodoCheckbox.id = 'complete';
    newTodoCheckbox.className = 'check-completed';
    newTodoCheckbox.dataset['id'] = todoid;
    newTodoCheckbox.onchange = function(e) { chkCompleteAction(e) };
    return newTodoCheckbox;
}
function createNewTodoDescription(description){
    const newTodoSpan = document.createElement('span');
    newTodoSpan.className = 'todotext';
    newTodoSpan.innerHTML = description;
    return newTodoSpan;
}
function createNewTodoDeleteButton(todoid){
    const newTodoDeleteButton = document.createElement('button');
    newTodoDeleteButton.type = 'submit';
    newTodoDeleteButton.id = 'delete-todo';
    newTodoDeleteButton.className = 'delete-todo';
    newTodoDeleteButton.dataset['id'] = todoid;
    newTodoDeleteButton.innerHTML = '&cross;';
    newTodoDeleteButton.onclick = function(e) { deleteTodo(e) };
    return newTodoDeleteButton;
}

function listsActionLoad() {
    const chkCompletes = document.querySelectorAll('#listcomplete');
    const delLists = document.querySelectorAll('#delete-list');
    for (let i = 0; i < chkCompletes.length; i++) {
        const chkComplete = chkCompletes[i];
        const delList = delLists[i];
        chkComplete.onchange = function(e) { chkListCompleteAction(e) }
        delList.onclick = function(e) { deleteList(e) }
    }
}

function chkListCompleteAction(e) {
    const compStatus = e.target.checked;
    console.log('compStatus: ' + compStatus);
    const listid = e.target.dataset['id'];
    fetch('../lists/' + listid + '/completeList', {
        method: 'POST',
        body: JSON.stringify({
            'completed': compStatus
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(){
        document.querySelector('#listerror').className = 'hidden';
        // location.reload();
        const todos = document.querySelectorAll('#complete');
        for (let i = 0; i < todos.length; i++) {
            todos[i].checked = compStatus;
        }
    })
    .catch(function(){
        document.querySelector('#listerror').className = '';
    })
}

function deleteList(e) {
    const listid = e.target.dataset['id'];
    fetch('../lists/' + listid + '/deleteList', {
        method: 'DELETE',
    })
    .then(function() {
        const listitem = e.target.parentElement;
        listitem.remove();
        // const todos = document.querySelectorAll('#todoitems')
        // todos.remove();
        location.reload();
        document.querySelector('#listerror').className = 'hidden';
    })
    .catch(function(){
        document.querySelector('#listerror').className = '';
    })
}

function todosActionLoad() {
    // TODOS
    // Assign the click action to all of the checkboxes and delete buttons
    // Get all checkboxes and delete buttons into arrays
    const chkCompletes = document.querySelectorAll('#complete');
    const delTodos = document.querySelectorAll('#delete-todo');
    // Loop through them to assign the function
    for (let i = 0; i < chkCompletes.length; i++) {
        const chkComplete = chkCompletes[i];
        const delTodo = delTodos[i];
        chkComplete.onchange = function(e) { chkCompleteAction(e) }
        delTodo.onclick = function(e) { deleteTodo(e) }
    }
}


function chkCompleteAction(e) {
    const compStatus = e.target.checked;
    const todoid = e.target.dataset['id'];
    fetch('../todos/' + todoid + '/updateCompStatus', {
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
    const todoid = e.target.dataset['id'];
    fetch('../todos/' + todoid + '/deleteTodo', {
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

function syncSelectedList() {
    const selected = document.querySelector('#selected');
    const list = document.querySelectorAll('#listitem');
    for (let i = 0; i < list.length; i++) {
        if (list[i].dataset['id'] == selected.innerHTML) {
            list[i].className = "todoitem selected";
            document.querySelector('#selectedlistname').innerHTML = list[i].querySelector('#listname').innerHTML
        } else {
            list[i].className = "todoitem";
        }
    }
}