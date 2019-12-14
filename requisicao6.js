const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const tasks = [];

app.post('/tasks', (request, response) => {
    const { body } = request;
    const task = {
        id: Math.random().toString().replace('0.', ''),
        title: body.title,
        resume: body.resume,
        isDone: body.isDone,
        isPriority: body.isPriority
    };
    tasks.push(task);
    response.status(201);
    response.send(task);
});

app.get('/tasks', (request, response) => {
    response.send(tasks);
});

app.get('/tasks/:taskId', (request, response) => {
    const task = tasks.find(t => t.id == request.params.taskId);
    if (task) {
    response.status(200);
    response.send(task);
    } else {
        response.status(404);
        response.send();
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('To Do Manager'));

app.listen(3000, () => console.log('Server Started on port 3000!'));