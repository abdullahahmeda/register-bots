const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const Telegram = require('telegraf/telegram')
const telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN)

const chatId = '-468139489';

bot.on('message', (ctx) => {
    if (ctx.update.message.chat.type === 'private') {
        ctx.reply(`المعرف الخاص بك هو: ${ctx.update.message.from.id}`);
    }
})

bot.on('new_chat_members', (ctx) =>  {

    if (ctx.message.chat.id == chatId)

    console.log(ctx)
    console.log('\n\n\n\n\n\n')
    console.log(ctx.message);
    console.log('\n\n\n\n\n\n')
    console.log(ctx.message.new_chat_members)
})

module.exports = bot;