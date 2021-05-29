const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

const sortValues = ['A-Z', 'Z-A', '食物類別', '上傳時間', '評價高低']
const sortTypes = [{ name: 'asc' }, { name: 'desc' }, { category: 'asc' }, { _id: 'desc' }, { rating: 'desc' }]
const sortObj = {}

for (i = 0; i < 5; i++) {
  sortObj[sortValues[i]] = sortTypes[i]
}

router.get('/', (req, res) => {
  const userId = req.user._id
  const sort = req.query.sort
  Restaurant.find({ userId })
    .lean()
    .sort(sortObj[sort])
    .then((restaurants => res.render('index', { restaurants, sort })))
    .catch(error => { console.log(error) })
})

module.exports = router