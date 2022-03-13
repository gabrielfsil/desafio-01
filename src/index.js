const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui

  const { username } = request.headers
  
  const user = users.find(user => user.username === username);

  if (!user) {

    return response.status(404).json({
      error: "user not found."
    })
  }
  
  request.username = username

  next();

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  let user = users.find(user => user.username === username);

  if (user) {
    return response.status(400).json({
      error: "username already in use."
    })
  }

  user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { username } = request

  const user = users.find(user => user.username === username);

  return response.status(200).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body

  const { username } = request

  const indexUser = users.findIndex(user => user.username === username);

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  users[indexUser].todos.push(todo)

  return response.status(201).json(todo)


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { username } = request

  const { id } = request.params
  const { title, deadline } = request.body

  const indexUser = users.findIndex(user => user.username === username);

  if (indexUser === -1) {

    return response.status(404).json({
      error: "user not found."
    })
  }

  const indexTodo = users[indexUser].todos.findIndex(todo => todo.id === id);

  if (indexTodo === -1) {

    return response.status(404).json({
      error: "todo not found."
    })
  }

  users[indexUser].todos[indexTodo].title = title
  users[indexUser].todos[indexTodo].deadline = deadline

  return response.status(200).json(users[indexUser].todos[indexTodo])


});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { username } = request

  const { id } = request.params

  const indexUser = users.findIndex(user => user.username === username);

  const indexTodo = users[indexUser].todos.findIndex(todo => todo.id === id);

  if (indexTodo === -1) {

    return response.status(404).json({
      error: "todo not found."
    })
  }

  users[indexUser].todos[indexTodo].done = true

  return response.status(200).json(users[indexUser].todos[indexTodo])


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { username } = request

  const { id } = request.params

  const indexUser = users.findIndex(user => user.username === username);

  if (indexUser === -1) {

    return response.status(404).json({
      error: "user not found."
    })
  }

  const indexTodo = users[indexUser].todos.findIndex(todo => todo.id === id);

  if (indexTodo === -1) {

    return response.status(404).json({
      error: "todo not found."
    })
  }

  users[indexUser].todos.splice(indexTodo, 1);

  return response.status(204).json()

});

module.exports = app;