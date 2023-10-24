const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res) => {
  return Todo.findAll({
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todos) => res.render('todos', { todos, message: req.flash('success') }))
    .catch((err) => res.status(422).json(err))
})

router.get('/new', (req, res) => {
  return res.render('new', { message: req.flash('error') })
})

router.post('/', (req, res) => {
  try {
    const name = req.body.name

    return Todo.create({ name })
      .then(() => {
        req.flash('success', '新增成功!')
        res.redirect('/todos')
      })

      .catch((err) => {
        console.error(err);
        req.flash('error', '新增失敗!')
        res.redirect('back')
      })
  } catch (error) {
    console.log(error);
    res.redirect('back')
  }

})

router.get('/:id', (req, res) => {
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

router.get('/:id/edit', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete'],
    raw: true
  })
    .then((todo) => res.render('edit', { todo }))
    .catch((err) => res.status(422).json(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isComplete } = req.body

  return Todo.update({ name, isComplete: isComplete === 'completed' }, { where: { id } })
    .then(() => {
      req.flash('success', '修改成功!')
      res.redirect(`/todos/${id}`)
    })
    .catch((err) => res.status(422).json(err))
})

router.delete('/:id', (req, res) => {
  return Todo.destroy({ where: { id: req.params.id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      res.redirect('/todos')
    })
    .catch((err) => res.status(422).json(err))
})

module.exports = router
