const User = require('../models').User
const adminSchema = require('../validation/adminSchema')
const telegram = require('../telegram-client')
const hashString = require('../utils/hashString')

module.exports = {
  index: async function (req, res) {
    const groupMembers = await telegram.getChatMembersCount(process.env.TELEGRAM_CHAT_ID)
    const dbMembers = await User.count() - 1 // exclude the admin
    return res.render('admin/index.html', {
      group_members: groupMembers,
      db_members: dbMembers
    })
  },

  edit: function (req, res) {
    return res.render('admin/settings')
  },

  update: async function (req, res) {
    delete req.body._csrf

    const { error, value } = adminSchema.validate(req.body, {
      abortEarly: false
    })

    if (error) {
      const errors = {}
      error.details.forEach(elm => {
        const path = elm.path[0]
        errors[path] = elm.message
      })

      req.flash('errors', errors)
      req.flash('old', req.body)
      return res.redirect('/custom-admin/settings')
    }

    const newObject = {
      name: value.name,
      telegramId: value.telegramId,
      email: value.email
    }
    if (value.password && value === value.password_confirmation) {
      const hash = hashString(value.password, process.env.BCRYPT_ROUNDS)
      newObject.password = hash
    }

    try {
      await User.update(newObject, {
        where: {
          id: req.session.user.id
        }
      })
      req.session.user = {
        ...req.session.user,
        ...value
      }
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        req.flash('message', 'هذا الايميل أو معرف التليجرام مستخدم من قبل مستخدم آخر')
        req.flash('type', 'danger')
        req.flash('old', req.body)
        return res.redirect('/custom-admin/settings')
      }
    }

    req.flash('message', 'تم تحديث بياناتك بنجاح')
    req.flash('type', 'success')
    return res.redirect('/custom-admin/settings')
  },

  logout: function (req, res) {
    req.session.user = null
    req.session.save(() => res.redirect('/tgadminlogin-123321ems'))
  }
}
