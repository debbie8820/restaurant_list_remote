const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb ready!')
})

app.use(bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', exphbs({ defaultLayout: "main" }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(methodOverride('_method'))

//首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants => res.render('index', { restaurants })))
    .catch(error => { console.log(error) })
})

//搜尋功能
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  return Restaurant.find()
    .lean()
    .then((restaurants) => {
      const searchedStores = restaurants.filter((store) => {
        return store.name.toLowerCase().includes(keyword) ||
          store.category.toLowerCase().includes(keyword)
      })
      res.render('index', { restaurants: searchedStores, keyword })
    })
    .catch(error => { console.log(error) })
})

//新增功能
app.get('/create', (req, res) => {
  res.render('new')
})

app.post('/create/new', (req, res) => {
  console.log(req.body)
  if (!req.body.image) {
    req.body.image = 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5628/02.jpg'
  }
  return Restaurant.create(req.body)
    .then(() => {
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

//修改餐廳資訊
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(error => { console.log(error) })
})


app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(req.params.id)
    .then((restaurant) => {
      restaurant.name = req.body.name
      restaurant.name_en = req.body.name_en
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.location = req.body.location
      restaurant.phone = req.body.phone
      restaurant.google_map = req.body.google_map
      restaurant.rating = req.body.rating
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => { res.redirect(`/${id}`) })
    .catch(error => { console.log(error) })
})

//刪除功能
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => { console.log(error) })
})

//瀏覽特定餐廳詳細資料(路由放最後因為放前面會出現cast ObjectId error)
app.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(specificRestaurant => res.render('show', { specificRestaurant }))
    .catch(error => { console.log(error) })
})

app.listen(3000, () => console.log('Server is ready!'))