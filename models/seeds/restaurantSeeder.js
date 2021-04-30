const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})


db.once('open', () => {
  console.log('mongodb ready!')
  restaurantList.results.forEach((item) => {
    Restaurant.create(item)
  })
  console.log('Seeds created')
})



