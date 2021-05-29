const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'The email is not registered!' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              return done(null, user)
            }
            return done(null, false, { message: 'Wrong email or password' })
          })
      })
      .catch(err => console.log(err))
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean() //有可能會把user資料傳到前端樣板使用，故先用lean將其轉為JS原生物件
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}