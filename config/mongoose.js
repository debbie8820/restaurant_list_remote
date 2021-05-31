if (process.env.NODE_ENV !== 'productino') {
  require('dotenv').config()
}
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb ready!')
})

module.exports = db