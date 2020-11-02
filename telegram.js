const Telegram = require('telegraf/telegram')
const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN)

const chatId = process.env.TELEGRAM_CHAT_ID;

module.exports = telegram;