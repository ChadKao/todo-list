const express = require('express');
const router = express.Router();

const db = require('../models')
const User = db.User;

router.get('/', (req, res) => { res.redirect('/users/login') });

router.get('/register', (req, res) => { res.render('register') });;

router.post('/register', (req, res, next) => {
  const { name, email, password, 'confirm-password': confirmPassword } = req.body

  if (!email || !password || !confirmPassword) {
    req.flash('error', 'email和密碼都是必填')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '密碼與驗證密碼不相符')
    return res.redirect('back')
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        req.flash('error', '信箱已被註冊')
        return res.redirect('back')
      }
      return User.create({ name, email, password })
        .then(() => {
          req.flash('success', '註冊成功')
          res.redirect('/users/login')
        })
        .catch(error => {
          error.errorMessage = '註冊失敗'
          next(error)
        })
    })
    .catch(error => {
      next(error)
    })
});

router.get('/login', (req, res) => { res.render('login') });

router.post('/login', (req, res) => { res.send(req.body) });

router.post('/logout', (req, res) => { res.send('logout') });

module.exports = router;