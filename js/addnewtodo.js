document.querySelector("#form").onsubmit = function(e) {
    e.preventDefault();
    const newDescription = document.querySelector("#description");
    const elTodos = document.querySelector('#todos');
    const elError = document.querySelector('#error')
    if (newDescription.value != '') {
        fetch('/todos/create', {
            method: 'POST',
            body: JSON.stringify({
                'description': newDescription.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then (response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            const liItem = document.createElement('li');
            liItem.innerText = jsonResponse['description'];
            document.querySelector("ul").appendChild(liItem);
            newDescription.value = '';
            elTodos.className = '';
            elError.className = 'hidden';
        })
        .catch(function() {
            elError.className = '';
            elTodos.className = 'hidden';
        })
    } else {
        window.alert("Please enter something!!");
    }