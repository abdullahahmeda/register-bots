const { Op } = require('sequelize')
const { isInChat } = require('../telegram-client/utils')
const telegram = require('../telegram-client')

const User = require('../models').User

module.exports = {
  index: async function (req, res) {
    const users = await User.findAll({
      where: {
        role: 'user',
        status: {
          [Op.or]: ['active', 'no quizzes']
        }
      }
    })
    return res.render('admin/users/index.html', {
      users
    })
  },

  activate: async (req, res) => {
    const userId = req.params.userId
    try {
      await User.update({ status: 'active' }, {
        where: {
          id: userId
        }
      })
      return res.json({
        status: '1',
        message: 'تم تفعيل حساب المستخدم بنجاح'
      })
    } catch (e) {
      return res.json({
        status: '0',
        message: 'حدث خطأ في تفعيل الحساب'
      })
    }
  },

  deactivate: async (req, res) => {
    const userId = req.params.userId
    try {
      await User.update({ status: 'no quizzes' }, {
        where: {
          id: userId
        }
      })
      return res.json({
        status: '1',
        message: 'تم تعطيل حساب المستخدم بنجاح'
      })
    } catch (e) {
      return res.json({
        status: '0',
        message: 'حدث خطأ في تعطيل الحساب'
      })
    }
  },

  ban: async function (req, res) {
    const telegramId = req.params.telegramId
    const isUserInChat = await isInChat(telegramId)
    if (isUserInChat) {
      try {
        await telegram.kickChatMember(process.env.TELEGRAM_CHAT_ID, telegramId)
        await User.update({ status: 'banned' }, {
          where: {
            telegramId
          }
        })
        return res.json({
          status: '1',
          message: 'تم حظر المستخدم بنجاح'
        })
      } catch (e) {
        return res.json({
          status: '0',
          message: 'حدث خطأ'
        })
      }
    } else {
      return res.json({
        status: '0',
        message: 'هذا المستخدم قد غادر المجموعة من قبل'
      })
    }
  },

  verify: async function (req, res) {
    const telegramId = req.params.telegramId
    try {
      await User.update({ status: 'active', verifiedAt: new Date() }, {
        where: {
          telegramId
        }
      })
      return res.json({
        status: '1',
        message: 'تم تفعيل حساب المستخدم بنجاح'
      })
    } catch (e) {
      return res.json({
        status: '0',
        message: 'حدث خطأ في تفعيل الحساب'
      })
    }
  },

  destroy: async function (req, res) {
    const telegramId = req.params.telegramId

    await User.destroy({
      where: {
        telegramId
      }
    })

    const isUserInChat = await isInChat(telegramId)
    if (isUserInChat) {
      try {
        if (req.body.should_ban) await telegram.kickChatMember(process.env.TELEGRAM_CHAT_ID, telegramId)
      } catch (e) {
        //
      }
    }

    return res.json({
      status: '1',
      message: 'تم حذف المستخدم بنجاح'
    })
  }
}
