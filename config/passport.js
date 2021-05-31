const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash('danger_msg', '這個 Email 尚未註冊')
          return done(null, false)
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              return done(null, user)
            }
            req.flash('danger_msg', '輸入的密碼不正確')
            return done(null, false)
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