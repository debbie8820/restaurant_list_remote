const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json')
const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.results.forEach((item) => {
    Restaurant.create(item)
  })
  console.log('Seeds created')
})



