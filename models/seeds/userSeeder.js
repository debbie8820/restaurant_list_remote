const userList = require('./users.json')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')

db.once('open', () => {
  return Promise.all(userList.map(user => {
    const { name, email, password } = user
    return bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash
      }))
  }))
    .then(() => {
      console.log('userSeeds created!')
      return db.close()
    }).then(() => console.log('Datebase connection is closed'))
})