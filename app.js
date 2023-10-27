const express = require('express')
const methodOverride = require('method-override')
const app = express()
const db = require('./models')
const Todo = db.Todo
const { engine } = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const router = require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
console.log(process.env.SESSION_SECRET);

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

app.listen(3000, () => {
  console.log('App is running on port 3000');
})