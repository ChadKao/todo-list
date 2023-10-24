const express = require('express');
const router = express.Router();

const todos = require('./todos')

router.use('/todos', todos)

router.get('/', (req, res) => {
  res.redirect('/todos')
})

module.exports = router;