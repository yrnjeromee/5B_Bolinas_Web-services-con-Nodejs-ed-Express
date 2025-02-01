const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servire file statici dalla cartella "public"
app.use("/", express.static(path.join(__dirname, "public")));

let todos = []; // Lista dei task

// Endpoint per aggiungere un nuovo To-Do
app.post("/todo/add", (req, res) => {
    const todo = req.body.todo;
    if (!todo || !todo.name) {
        return res.status(400).json({ error: "Il campo 'name' è richiesto." });
    }
    
    todo.id = "" + new Date().getTime();
    todos.push(todo);
    res.json({ result: "Ok", todo });
});

// Endpoint per ottenere la lista dei To-Do
app.get("/todo", (req, res) => {
    res.json({ todos });
});

// Endpoint per completare un To-Do
app.put("/todo/complete", (req, res) => {
    const todo = req.body;
    let found = false;

    todos = todos.map((element) => {
        if (element.id === todo.id) {
            element.completed = true;
            found = true;
        }
        return element;
    });

    if (!found) {
        return res.status(404).json({ error: "To-Do non trovato" });
    }

    res.json({ result: "Ok" });
});

// Endpoint per eliminare un To-Do
app.delete("/todo/:id", (req, res) => {
    const id = req.params.id;
    const initialLength = todos.length;
    todos = todos.filter((element) => element.id !== id);

    if (todos.length === initialLength) {
        return res.status(404).json({ error: "To-Do non trovato" });
    }

    res.json({ result: "Ok" });
});

// Avvia il server sulla porta 3000
const server = http.createServer(app);
server.listen(3000, () => {
    console.log("- server running on port 3000");
});
