const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const users = require('./modules/users')
const sort = require('./modules/sort')
const { authenticator } = require('../middleware/auth')

router.use('/restaurants', authenticator, restaurant)
router.use('/sort', authenticator, sort)
router.use('/users', users)
router.use('/', home)

module.exports = router