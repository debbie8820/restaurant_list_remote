const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

const app = express()

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb ready!')
})

app.engine('handlebars', exphbs({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')


app.use(express.static('public'))

//首頁
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants => res.render('index', { restaurants })))
    .catch(error => { console.log(error) })
})

app.get("/restaurants/:id", (req, res) => {
  const specificRestaurant = restaurantList.results.find((store) =>
    store.id.toString() === req.params.id
  )
  res.render("show", { specificRestaurant })
})

app.get("/search", (req, res) => {
  const keyword = req.query.keyword

  const searchedStores = restaurantList.results.filter((store) => {

    return store.name.toLowerCase().includes(keyword) ||
      store.category.toLowerCase().includes(keyword)
  })
  res.render("index", { restaurants: searchedStores, keyword })
})

app.listen(3000, () => console.log("Server is ready!"))