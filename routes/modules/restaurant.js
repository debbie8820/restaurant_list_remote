const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//搜尋功能
router.get('/search', (req, res) => {
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
router.get('/create', (req, res) => {
  res.render('new')
})

router.post('/create', (req, res) => {
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
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(error => { console.log(error) })
})


router.put('/:id', (req, res) => {
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
    .then(() => { res.redirect(`./show/${id}`) })
    .catch(error => { console.log(error) })
})

//刪除功能
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => { console.log(error) })
})

//瀏覽特定餐廳詳細資料(路由放最後因為放前面會出現cast ObjectId error)
router.get('/show/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(specificRestaurant => res.render('show', { specificRestaurant }))
    .catch(error => { console.log(error) })
})

module.exports = router