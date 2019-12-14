const express = require('express');
const app = express();
const bodyParser = require('body-parser');
let idCont=0;
const jwt = require('jsonwebtoken');
const SEGREDO = 'euvoupracasa';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function cobrarTokenJWT(req, resp, next) {
    if (req.url == '/login') {
        next();
    }

    var token = req.headers['x-access-token'];
    try {
        var decodificado = jwt.verify(token, SEGREDO);
        next();
    } catch (e) {
        resp.status(500).send({ message: 'token invalido' })
    }

}
app.use(cobrarTokenJWT);

app.get('/', (req, resp) => {
    resp.send('resposta');
});

var tasks = [];

app.post('/tasks', (request, response) => {
    const { body } = request;
    idCont++;
    const task = {
        id: idCont,
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

app.put('/tasks/:taskId', (request, response) => {
    const { body } = request;
    const task = tasks.find(t => t.id == request.params.taskId);
    if (task) {
        task.title = body.title;
        task.resume = body.resume;
        task.isDone = body.isDone;
        task.isPriority = body.isPriority;
        response.send(task);
    } else {
        response.status(404);
        response.send();
    }
});

app.delete('/tasks/:taskId', (request, response) => {
    var task = tasks.find(t => t.id == request.params.taskId);
    if (task) {
        tasks = tasks.filter(t => t.id != request.params.taskId);
        response.status(200).send(task)
    } else {
        response.status(404).send()
    }
});

app.post('/login', (req, resp) => {
    var body = req.body;
    if (body.username == 'usuario' && body.password == '123456') {
        var token = jwt.sign({ username: 'usuario', role: 'admin' }, SEGREDO, {
            expiresIn: '1h'
        });
        resp.send({ auth: true, token });
    } else {
        resp.status(403).send({ auth: false, message: 'Error in username or password' });
    }
})
app.listen(3000);