const { Op } = require('sequelize')
const userRegisterSchema = require('../validation/userRegisterSchema')
const User = require('../models').User
const sendVerifySMS = require('../services/sms-sender')
const { isNil, makeCode, makeToken } = require('../utils/helpers')
const getCountryCode = require('../utils/getCountryCode')
const { isInChat } = require('../telegram-client/utils')
const telegram = require('../telegram-client')
const VerificationCode = require('../models').VerificationCode
const BannedEmail = require('../models').BannedEmail

module.exports = {
  index: async function (req, res) {
    const country = await getCountryCode(req.ipAddress)
    return res.render('register', { country })
  },

  store: async function (req, res) {
    delete req.body._csrf
    const { error: validationError, value: values } = userRegisterSchema.validate(
      req.body,
      { abortEarly: true }
    )
    if (validationError) {
      return res.render('register', {
        flash: {
          validationError: {
            path: validationError.details[0].path,
            message: validationError.details[0].message
          },
          old: req.body
        }
      })
    }

    if (values.speciality === 'غير ذلك') {
      values.speciality = values.other_speciality
    }
    delete values.other_speciality

    // Check if email is banned
    const bannedEmail = await BannedEmail.findOne({
      where: {
        address: values.email
      }
    })

    if (bannedEmail) {
      return res.render('register', {
        flash: {
          message: 'هذا الايميل محظور',
          type: 'danger',
          old: req.body
        }
      })
    }

    // Verify user on telegram
    try {
      const userTelegram = await telegram.getChatMember(values.telegramId, values.telegramId)
      // console.log(userTelegram)
    } catch (e) {
      return res.render('register', {
        flash: {
          message: 'معرف التلجرام غير صحيح',
          type: 'danger',
          old: req.body
        }
      })
    }

    values.ipAddress = req.ipAddress
    let duplicateUser
    try {
      duplicateUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: values.email },
            { phone: values.phone },
            { telegramId: values.telegramId }
          ],
          status: 'active'
        }
      })
    } catch (error) {
      return res.render('register', {
        flash: {
          message: 'حدث خطأ ما. يرجى إعادة المحاولة',
          type: 'danger',
          old: req.body
        }
      })
    }

    if (duplicateUser) {
      let message
      if (duplicateUser.email == values.email) {
        message = 'الايميل مستخدم بالفعل'
      }
      if (duplicateUser.phone == values.phone) {
        message = 'رقم الهاتف مستخدم بالفعل'
      }
      if (duplicateUser.telegramId == values.telegramId) {
        if (await isInChat(duplicateUser.telegramId)) message = 'معرف التلجرام مستخدم بالفعل'
        else {
          const code = makeCode()
          const token = makeToken()
          try {
            await VerificationCode.create({
              token,
              code,
              userId: duplicateUser.id
            })
          } catch (e) {
            /* req.flash('type', 'danger');
                  req.flash('old', req.body); */
          }
          if (process.env.NODE_ENV !== 'production') console.log(`Activation Code: ${code}`)
          else sendVerifySMS(`966${values.phone.slice(1)}`, `${code}`)

          return res.redirect('/verify/' + token)
        }
      }
      return res.render('register', {
        flash: {
          message,
          type: 'danger',
          old: req.body
        }
      })
    }

    let user
    try {
      user = await User.create(values)
    } catch (error) {
      return res.render('register', {
        flash: {
          message: 'حدث خطأ ما. يرجى إعادة المحاولة',
          type: 'danger',
          old: req.body
        }
      })
    }

    const code = makeCode()
    const token = makeToken()
    try {
      await VerificationCode.create({
        token,
        code,
        userId: user.id
      })
    } catch (e) {
      /* req.flash('type', 'danger');
            req.flash('old', req.body); */
    }
    if (process.env.NODE_ENV !== 'production') console.log(`Activation Code: ${code}`)
    else sendVerifySMS(`966${values.phone.slice(1)}`, `${code}`)

    return res.redirect('/verify/' + token)
  },

  verifyGet: function (req, res) {
    return res.render('verify')
  },

  verifyPost: async function (req, res) {
    const token = req.params.token
    const code = req.body.code

    const row = await VerificationCode.findOne({
      where: {
        token,
        code
      }
    })
    if (isNil(row)) {
      return res.json({
        status: '0',
        message: 'هذا الكود غير صحيح'
      })
    }

    try {
      const user = await User.findOne({
        where: {
          id: row.userId
        }
      })

      if (isNil(user)) {
        return res.json({
          status: '0',
          message: 'حدث خطأ أثناء التفعيل، الرجاء إعادة المحاولة'
        })
      }

      const duplicateUsersCount = await User.count({
        where: {
          [Op.or]: [
            { email: user.email },
            { phone: user.phone },
            { telegramId: user.telegramId }
          ],
          status: 'active'
        }
      })
      if (duplicateUsersCount > 1) {
        return res.json({
          status: '0',
          message: 'هذا الحساب مسجل بالفعل'
        })
      }
    } catch (e) {
      return res.json({
        status: '0',
        message: 'حدث خطأ أثناء التفعيل، الرجاء إعادة المحاولة'
      })
    }

    try {
      await User.update({
        verifiedAt: new Date(),
        status: 'active'
      }, {
        where: {
          id: row.userId
        }
      })

      await VerificationCode.destroy({
        where: {
          token,
          code
        }
      })
    } catch (e) {
      return res.json({
        status: '0',
        message: 'حدث خطأ أثناء التفعيل، الرجاء إعادة المحاولة'
      })
    }

    return res.json({
      status: '1',
      message: 'تم التفعيل بنجاح'
    })
  }

}
