const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../../models/user')
const passport = require('passport')
const validator = require('../../middleware/validator')

router.get('/login', (req, res) => { return res.render('login') })

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => { return res.render('register') })

router.post('/register', validator.register, (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body

  return User.findOne({ email })
    .then(user => {
      if (user) {
        const errors = []
        errors.push({ msg: '此 Email 已被註冊' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            name,
            email,
            password: hash
          })
            .then(() => {
              req.flash('success_msg', '你已成功註冊')
              return res.redirect('/users/login')
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout() //passport提供的函式，會將session資料清除
  req.flash('success_msg', '你已成功登出')
  return res.redirect('/users/login')
})

module.exports = router