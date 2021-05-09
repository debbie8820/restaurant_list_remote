const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('./config/mongoose')

const routes = require('./routes')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

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
app.use(routes)

app.listen(3000, () => console.log('Server is ready!'))