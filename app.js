const express = require('express')
const app = express()
const port = 3000
const restaurant_list = require('./restaurant.json')

const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render('index', { restaurants: restaurant_list.results })
})

app.get("/restaurants/:id", (req, res) => {
  const specificRestaurant = restaurant_list.results.find((store) =>
    store.id.toString() === req.params.id
  )
  res.render("show", { restaurant: specificRestaurant })
})

app.get("/search", (req, res) => {
  const searchedStores = restaurant_list.results.filter((store) => {
    return store.name.toLowerCase().includes(req.query.keyword)
  })
  res.render("index", { restaurants: searchedStores, keyword: req.query.keyword })
})


app.listen(port, () => console.log("ready!"))