const express = require('express')
const app = express()
const port = 3000
const restaurantList = require('./restaurant.json')

const exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
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

app.listen(port, () => console.log("Server is ready!"))