const express = require('express');
const router = express.Router();

const db = require('../models')
const User = db.User;

router.get('/', (req, res) => { res.redirect('/users/login') });

router.get('/register', (req, res) => { res.render('register') } ); ;

router.post('/register', (req, res) => { res.send(req.body) });

router.get('/login', (req, res) => { res.render('login') });

router.post('/login', (req, res) => { res.send(req.body) });

router.post('/logout', (req, res) => { res.send('logout') });

module.exports = router;