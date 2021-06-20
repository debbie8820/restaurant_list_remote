const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const sortTypes = {
  AZ: { name: 'asc' },
  ZA: { name: 'desc' },
  category: { category: 'asc' },
  timeN: { _id: 'desc' },
  timeO: { _id: 'asc' },
  rating: { rating: 'desc' }
}

//搜尋功能(根據中、英文名稱和類別搜尋) + 篩選功能
router.get('/search', (req, res) => {
  const { keyword } = req.query
  const { _id: userId } = req.user
  const sort = req.query.sort ? req.query.sort : 'AZ'
  const query =
  {
    $or: [
      { name: { $regex: keyword, $options: 'i' }, userId },
      { name_en: { $regex: keyword, $options: 'i' }, userId },
      { category: { $regex: keyword, $options: 'i' }, userId },
    ]
  }

  return Restaurant.find(query)
    .lean()
    .sort(sortTypes[sort])
    .then((restaurants) => {
      if (!restaurants.length) {
        return res.render('index', { noResult: true, keyword, sort })
      }
      return res.render('index', { restaurants, keyword, sort })
    })
    .catch(err => res.render('error', { err }))
})

//新增功能
router.get('/create', (req, res) => res.render('new'))

router.post('/create', (req, res) => {
  if (!req.body.image) {
    req.body.image = 'https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5628/02.jpg'
  }
  req.body.userId = req.user._id
  return Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(err => res.render('error', { err }))
})

//修改餐廳資訊
router.get('/:id/edit', (req, res) => {
  const { _id: userId } = req.user
  const { id: _id } = req.params
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => { res.render('edit', { restaurant }) })
    .catch(err => res.render('error', { err }))
})

router.put('/:id', (req, res) => {
  const { _id: userId } = req.user
  const { id: _id } = req.params
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => {
      Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => { res.redirect(`./show/${_id}`) })
    .catch(err => res.render('error', { err }))
})

//刪除功能
router.delete('/:id', (req, res) => {
  const { _id: userId } = req.user
  const { id: _id } = req.params
  return Restaurant.findOne({ _id, userId })
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(err => res.render('error', { err }))
});

//瀏覽特定餐廳詳細資料(路由放最後因為放前面會出現cast ObjectId error)
router.get('/show/:id', (req, res) => {
  const { _id: userId } = req.user
  const { id: _id } = req.params
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(specificRestaurant => { return res.render('show', { specificRestaurant }) })
    .catch(err => { return res.render('error', { err }) })
})

module.exports = router