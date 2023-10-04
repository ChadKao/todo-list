const express = require('express')
const methodOverride = require('method-override')
const app = express()
const db = require('./models')
const Todo = db.Todo
const { engine } = require('express-handlebars')

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  res.redirect('/todos')
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name

  return Todo.create({ name })
    .then(() => res.redirect('/todos'))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('todo', { todo }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => res.status(422).json(err))
})

app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const body = req.body

  return Todo.update({ name: body.name }, { where: { id } })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((err) => res.status(422).json(err))
})

app.delete('/todos/:id', (req, res) => {
  return Todo.destroy({ where: { id: req.params.id } })
    .then(() => res.redirect('/todos'))
    .catch((err) => res.status(422).json(err))
})


app.listen(3000, () => {
  console.log('App is running on port 3000');
})