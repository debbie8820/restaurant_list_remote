const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: String,
  category: {
    type: String,
    required: true
  },
  image: String,
  location: String,
  phone: String,
  google_map: String,
  rating: {
    type: Number,
    required: true
  },
  description: String
})

module.exports = mongoose.model('Restaurant', restaurantSchema)