const express = require('express');
const router = express.Router();

const db = require('../models')
const User = db.User;
const passport = require('passport')
const localStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')
require('dotenv').config()

passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
  return User.findOne({
    attributes: ['id', 'name','email', 'password'],
    where: { email },
    raw: true
  })
    .then(user => {
      if (!user) {
        return done(null, false, { message: '帳號或密碼錯誤' })
      }

      return bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: '帳號或密碼錯誤' })
          }

          return done(null, user)
        })
    })
    .catch(error => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  const { name, email } = profile._json
  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
    raw: true
  })
    .then(user => {
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      
      return bcrypt.hash(randomPassword, 10)
        .then(hash =>  User.create({ name, email, password: hash }))
        .then(user => done(null, { id: user.id, email: user.email, name: user.name }))
    })
    .catch(error => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.serializeUser((user, done) => {
  const { id, email, name } = user
  done(null, { id, email, name })
})

passport.deserializeUser((user, done) => {
  const id = user.id
  done(null, { id })
})

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
      bcrypt.hash(password, 10)
        .then(hash => {
          return User.create({ name, email, password: hash })
        })
        .then((user) => {
          if (!user) {
            req.flash('error', '註冊失敗')
            return res.redirect('back')
          }
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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/todos',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/todos',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) { return next(error) }
    req.flash('success', '登出成功')
    res.redirect('/users/login')
  })
});

module.exports = router;