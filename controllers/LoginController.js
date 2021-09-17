const User = require('../models').User
const bcrypt = require('bcryptjs')
const userLoginSchema = require('../validation/userLoginSchema')
const { isNil } = require('../utils/helpers')

module.exports = {
  index: function (req, res) {
    return res.render('login')
  },
  login: async function (req, res) {
    delete req.body._csrf

    const { error, value } = userLoginSchema.validate(req.body, {
      abortEarly: false
    })

    if (error) {
      return res.render('login', {
        flash: {
          message: 'الرجاء إدخال بريد إلكتروني وكلمة مرور صالحتين',
          type: 'danger',
          old: req.body
        }
      })
    }

    let user = await User.findOne({
      where: {
        email: value.email,
        status: 'active'
      }
    })

    if (isNil(user)) {
      return res.render('login', {
        flash: {
          message: 'البيانات المدخلة غير صحيحة',
          type: 'danger',
          old: req.body
        }
      })
    }

    console.log(value.password, user.password)

    if (!bcrypt.compareSync(value.password, user.password)) {
      return res.render('login', {
        flash: {
          message: 'كلمة المرور غير صحيحة',
          type: 'danger',
          old: req.body
        }
      })
    }

    user = user.toJSON()

    delete user.password
    req.session.user = user
    req.session.save(() => res.redirect('/custom-admin'))
  }
}
