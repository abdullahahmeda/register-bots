require('dotenv').config()

const Telegram = require('telegraf/telegram')
const telegramClient = new Telegram(process.env.TELEGRAM_BOT_TOKEN)

module.exports = telegramClient
