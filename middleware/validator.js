const { body, validationResult } = require('express-validator')

//需要驗證的欄位要放進array
module.exports.register = [

  body('email').trim().not().isEmpty().withMessage('信箱為必填').isEmail().withMessage('請填入正確的信箱格式'),

  body('password').trim().not().isEmpty().withMessage('密碼為必填').isLength({ min: 6 }).withMessage('密碼須至少6個字元').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/).withMessage('密碼須包含大小寫字母和數字'),

  body('confirmPassword').trim().not().isEmpty().withMessage('確認密碼為必填').custom((confirmPassword, { req }) => {
    const password = req.body.password
    if (confirmPassword !== password) {
      throw new Error('密碼與確認密碼不符');
    }
    return true
  }),

  (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    const { errors } = validationResult(req)
    console.log(errors)
    if (errors.length) {
      return res.status(422).render('register', { errors, name, email, password, confirmPassword })
    }
    return next()
  }

]