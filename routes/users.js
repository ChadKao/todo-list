const express = require('express');
const router = express.Router();

const db = require('../models')
const User = db.User;

router.get('/', (req, res) => { res.redirect('/users/login') });

router.get('/register', (req, res) => { res.send('register') });

router.post('/register', (req, res) => { res.send('register') });

router.get('/login', (req, res) => { res.send('login') });

router.post('/login', (req, res) => { res.send('login') });

router.post('/logout', (req, res) => { res.send('logout') });

module.exports = router;