const Telegraf = require('telegraf')
const utils = require('./telegram-client/utils')
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  username: process.env.TELEGRAM_BOT_USERNAME
})
const User = require('./models').User

const chatId = process.env.TELEGRAM_CHAT_ID

const { isNil } = require('./utils/helpers')

const replyToPrivateMessage = (context) => {
  context.reply(`
للأنضمام لمجموعة الخدمات الطبية الطارئة

اولاً تأكد ان التليجرام عندك محدث لأخر نسخة ثم اتبع التالي :
        
1- انسخ رقم معرف التليجرام التالي: ${context.update.message.from.id} 
        
2-سجّل لك عضوية من الرابط التالي:
www.eemsr.com/tgc`)
}

bot.on('text', async (context) => {
  if (context.update.message.chat.type === 'private') replyToPrivateMessage(context)
  else if (`${context.update.message.chat.id}` === `${chatId}`) {
    const messageId = context.update.message.message_id
    const senderId = context.update.message.from.id

    const user = await User.findOne({
      where: {
        telegramId: senderId,
        status: 'active'
      }
    })

    if (isNil(user)) { // User is not registered
      await utils.deleteGroupMessage(messageId)
    }
  }
})

module.exports = bot
