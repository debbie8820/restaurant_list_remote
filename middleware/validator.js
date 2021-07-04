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
    if (errors.length) {
      return res.status(422).render('register', { errors, name, email, password, confirmPassword })
    }
    return next()
  }

]

module.exports.restaurant = [

  body('name').trim().not().isEmpty().withMessage('餐廳名稱為必填').isLength({ min: 1, max: 20 }).withMessage('餐廳名稱須在20字內'),
  body('category').trim().not().isEmpty().withMessage('餐廳類別為必填'),
  body('rating').trim().not().isEmpty().withMessage('評分為必填').isFloat({ min: 1, max: 5 }).withMessage('評分範圍為1-5分'),
  body('location').trim().isLength({ max: 50 }).withMessage('地址須在50字以內').optional({ nullable: true, checkFalsy: true }),
  body('description').trim().isLength({ max: 100 }).withMessage('餐廳描述須在100字以內'),
  body('name_en').trim().matches(/^[a-zA-Z0-9]{1,}$/).withMessage('英文名稱請輸入英文').optional({ nullable: true, checkFalsy: true }),
  body('tel').trim().matches(/^0[2-9]{1}[0-9]{8}$/).withMessage('請輸入正確的電話格式').optional({ nullable: true, checkFalsy: true }),
  body('image').trim().isURL().withMessage('請輸入正確的圖片網址').optional({ nullable: true, checkFalsy: true }),
  body('google_map').trim().isURL().withMessage('請輸入正確的Google Map網址').optional({ nullable: true, checkFalsy: true }),

  (req, res, next) => {
    const { name, category, rating, description, name_en, tel, image, google_map } = req.body
    const { errors } = validationResult(req)
    if (errors.length) {
      return res.status(422).render('new', { errors, name, category, rating, description, name_en, tel, image, google_map })
    }
    return next()
  }


]