const express = require('express')
const router = express.Router()

const db = require('../models')
const Todo = db.Todo

router.get('/', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 10

  return Todo.findAndCountAll({
    attributes: ['id', 'name', 'isComplete'],
    offset: (page - 1) * limit,
    limit,
    where: { userId: req.user.id },
    raw: true
  })
    .then((result) => {
      const todos = result.rows
      const totalPages = Math.ceil(result.count / limit)

      res.render('todos', {
        todos,
        prev: page > 1 ? page - 1 : page,
        next: page < totalPages ? page + 1 : page,
        page
      })
    }
  )
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res, next) => {
  const name = req.body.name
  const userId = req.user.id

  return Todo.create({ name, userId })
    .then(() => {
      req.flash('success', '新增成功!')
      res.redirect('/todos')
    })

    .catch((error) => {
      error.errorMessage = '新增失敗'
      next(error)
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料!')
        return res.redirect('/todos')
      }

      if (todo.userId !== req.user.id) {
        req.flash('error', '您沒有權限瀏覽此頁面!')
        return res.redirect('/todos')
      }
      res.render('todo', { todo })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
    raw: true
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料!')
        return res.redirect('/todos')
      }

      if (todo.userId !== req.user.id) {
        req.flash('error', '您沒有權限瀏覽此頁面!')
        return res.redirect('/todos')
      }

      res.render('edit', { todo })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗'
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  const { name, isComplete } = req.body

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料!')
        return res.redirect('/todos')
      }

      if (todo.userId !== req.user.id) {
        req.flash('error', '您沒有權限修改內容!')
        return res.redirect('/todos')
      }
      
      return todo.update({ name, isComplete: isComplete === 'completed' })
        .then(() => {
          req.flash('success', '修改成功!')
          res.redirect(`/todos/${id}`)
        })
    })
    .catch((error) => {
      error.errorMessage = '修改失敗'
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id

  return Todo.findByPk(id, {
    attributes: ['id', 'name', 'isComplete', 'userId'],
  })
    .then((todo) => {
      if (!todo) {
        req.flash('error', '找不到資料!')
        return res.redirect('/todos')
      }

      if (todo.userId !== req.user.id) {
        req.flash('error', '您沒有權限刪除內容!')
        return res.redirect('/todos')
      }

      return todo.destroy()
        .then(() => {
          req.flash('success', '刪除成功!')
          res.redirect('/todos')
        })
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗'
      next(error)
    })
})

module.exports = router
