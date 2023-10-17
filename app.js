const express = require('express')
const methodOverride = require('method-override')
const app = express()
const db = require('./models')
const Todo = db.Todo
const { engine } = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.get('/', (req, res) => {
  res.redirect('/todos')
})

app.get('/todos', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos, message: req.flash('success')  }))
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name

  return Todo.create({ name })
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/todos')
    })
    
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => {
      res.render('todo', { todo, message: req.flash('success') })
    })
    .catch((err) => res.status(422).json(err))
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => res.status(422).json(err))
})

app.put('/todos/:id', (req, res) => {
  const id = req.params.id
  const { name, isComplete } = req.body

  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功!')
      res.redirect(`/todos/${id}`)
    })
    .catch((err) => res.status(422).json(err))
})

app.delete('/todos/:id', (req, res) => {
  return Todo.destroy({ where: { id: req.params.id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      res.redirect('/todos')
    })
    .catch((err) => res.status(422).json(err))
})


app.listen(3000, () => {
  console.log('App is running on port 3000');
})