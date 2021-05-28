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
  description: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)