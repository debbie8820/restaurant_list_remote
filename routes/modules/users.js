const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  if (!email || !password || !confirmPassword) {
    console.log('有欄位沒填寫')
    return res.render('register', { name, email, password, confirmPassword })
  }
  if (password !== confirmPassword) {
    console.log('密碼和確認密碼不符合')
    return res.render('register', { name, email, password, confirmPassword })
  }
  return User.findOne({ email })
    .then(user => {
      if (user) {
        return console.log('此 Email 已被註冊')
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            name,
            email,
            password: hash
          })
        })
        .then(() => res.redirect('/users/login'))
        .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout() //passport提供的函式，會將session資料清除
  res.redirect('/users/login')
  console.log('你已成功登出')
})

module.exports = router