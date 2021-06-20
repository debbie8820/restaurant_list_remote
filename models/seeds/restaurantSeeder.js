const Restaurant = require('../restaurant')
const restaurantList = require('./restaurant.json')
const db = require('../../config/mongoose')
const User = require('../../models/user')
const userList = require('./users.json')

db.once('open', async () => {
  try {
    for (let i = 0; i < 2; i++) {
      const user = await User.findOne({ email: userList[i].email })
      return Promise.all(restaurantList.results.slice(3 * i, 3 * (i + 1)).map(async (items) => {
        items.userId = user._id
        return await Restaurant.create(items)
      }))
    }
  } catch (err) {
    return console.log(err)
  }
  console.log('Seeds are created')
  return db.close()
})