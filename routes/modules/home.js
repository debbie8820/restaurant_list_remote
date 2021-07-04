const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res, next) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ name: 'asc' })
    .then((restaurants => {
      if (!restaurants.length) {
        return res.render('index', { noRestaurants: true })
      }
      return res.render('index', { restaurants })
    }))
    .catch(err => next(err))
})

module.exports = router