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
        // Add the text for the new todo to the list item
        todospan = document.createElement('span');
        todospan.className = 'todotext';
        todospan.innerHTML = jsonResponse['description'];
        // Append the new list item to the unordered list of todos
        todoitem.appendChild(todospan);
        todoitems.appendChild(todoitem);
        // Clear text from the text box ready for a new entry
        document.querySelector('#description_a').value = '';
        document.querySelector('#error').className = 'hidden';
    })
    .catch(function() {
        document.querySelector('#error').className = '';
    })
}