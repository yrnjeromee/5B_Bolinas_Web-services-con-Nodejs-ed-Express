// Definizione delle variabili DOM
const todoInput = document.getElementById("todoInput");
const insertButton = document.getElementById("insertButton");
const todoListContainer = document.getElementById("todolist");

let todos = []; // Lista dei task

// Funzione per aggiornare la visualizzazione della lista
const render = () => {
    let html = '';
    todos.forEach((todo) => {
        html += `
            <li ${todo.completed ? 'class="completed"' : ''}>
                ${todo.name}
                <button onclick="completeTask('${todo.id}')">Completa</button>
                <button onclick="deleteTask('${todo.id}')">Elimina</button>
            </li>
        `;
    });
    todoListContainer.innerHTML = html; // Aggiorna il contenuto della lista
};

// Funzione per inviare una nuova To-Do al server
const send = (todo) => {
    return fetch("/todo/add", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    })
    .then(response => response.json());
};

// Funzione per caricare i To-Do dal server
const load = () => {

    return new Promise((resolve, reject) => {
 
       fetch("/todo")
 
       .then((response) => response.json())
 
       .then((json) => {
 
          resolve(json); // risposta del server con la lista
 
       })
 
    })
 
 }

// Aggiunge un nuovo To-Do alla lista
insertButton.onclick = () => {
    console.log("ciao")
    const todo = {          
        name: todoInput.value,
        completed: false
    };
    
    send({ todo }) // 1. Invia la nuova To-Do
    .then(() => load()) // 2. Ricarica la lista aggiornata
    .then((json) => { 
        todos = json.todos;
        todoInput.value = ""; // Svuota il campo input
        render();  // 3. Aggiorna la visualizzazione
    });
};

// Funzione per completare un To-Do
const completeTask = (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = true;
        completeTodo(todo)
            .then(() => render());
    }
};

// Funzione per eliminare un To-Do
const deleteTask = (id) => {
    deleteTodo(id)
        .then(() => {
            todos = todos.filter(t => t.id !== id);
            render();
        });
};

// API per completare un To-Do nel server
const completeTodo = (todo) => {
    return fetch("/todo/complete", {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    })
    .then(response => response.json());
};

// API per eliminare un To-Do nel server
const deleteTodo = (id) => {
    return fetch("/todo/" + id, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json());
};

// Aggiornamento periodico della lista
setInterval(() => {
    load().then((json) => {
        todos = json.todos;
        render();
    });
}, 60000); // Aggiorna ogni 60 secondi

// Carica la lista dei task dal server all'avvio
load().then((json) => {
    todos = json.todos;
    render();
});