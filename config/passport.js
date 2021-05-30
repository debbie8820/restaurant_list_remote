const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
            return done(null, false, { message: 'Email or password incorrect' })
          })
      })
      .catch(err => console.log(err))
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ email })
      .then((user) => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }));

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