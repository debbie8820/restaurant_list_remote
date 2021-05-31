const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

require('./config/mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const routes = require('./routes')

const app = express()
const PORT = process.env.PORT
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET, //只有伺服器知道的的密鑰
  resave: false,
  saveUninitialized: true
}))


app.engine('handlebars', exphbs({
  defaultLayout: "main",
  helpers: {
    eq: function (v1, v2) { return (v1 === v2) }
  }
})
)

app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(methodOverride('_method'))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.danger_msg = req.flash('danger_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => console.log('Server is ready!'))