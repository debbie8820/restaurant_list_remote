const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const users = require('./modules/users')
const sort = require('./modules/sort')

router.use('/restaurants', restaurant)
router.use('/users', users)
router.use('/sort', sort)
router.use('/', home)

module.exports = router