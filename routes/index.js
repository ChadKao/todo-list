const express = require('express');
const router = express.Router();

const authHandler = require('../middlewares/auth-handler')

const todos = require('./todos')
const users = require('./users')

router.use('/todos', authHandler, todos)
router.use('/users', users)


router.get('/', (req, res) => {
  res.redirect('/todos')
})

module.exports = router;