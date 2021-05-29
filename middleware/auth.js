module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    }
    return res.redirect('/users/login')
  }
}