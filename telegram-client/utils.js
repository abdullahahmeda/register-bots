require('dotenv').config()
const telegram = require('.')

async function isInChat (telegramId) {
  try {
    const user = await telegram.getChatMember(
      process.env.TELEGRAM_CHAT_ID,
      telegramId
    )
    return user.status === 'member'
  } catch (e) {
    return false
  }
}

async function allowUserToSendMessages (telegramId) {
  try {
    const s = await telegram.restrictChatMember(
      process.env.TELEGRAM_CHAT_ID,
      telegramId,
      {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_other_messages: true
      }
    )
    console.log('updated ', s)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function denyUserToSendMessages (telegramId) {
  try {
    const s = await telegram.restrictChatMember(
      process.env.TELEGRAM_CHAT_ID,
      telegramId,
      {
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_other_messages: false
      }
    )
    console.log('updated ', s)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

async function deleteGroupMessage (messageId) {
  try {
    await telegram.deleteMessage(process.env.TELEGRAM_CHAT_ID, messageId)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = {
  isInChat,
  allowUserToSendMessages,
  denyUserToSendMessages,
  deleteGroupMessage
}
