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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(3000, () => console.log('Server Started on port 3000!'));