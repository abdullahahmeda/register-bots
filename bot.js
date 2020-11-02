const Telegraf = require('telegraf');
const utils = require('./utils');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const User = require('./models').User;

const chatId = process.env.TELEGRAM_CHAT_ID;

bot.on('message', (ctx) => {
    if (ctx.update.message.chat.type === 'private') {
        ctx.reply(`المعرف الخاص بك هو: ${ctx.update.message.from.id}`);
    }
})

bot.on('new_chat_members', (ctx) =>  {

    /* if (ctx.message.chat.id == chatId) {
        
    } */

    console.log(ctx)
    console.log('\n\n\n\n\n\n')
    console.log(ctx.message);
    console.log('\n\n\n\n\n\n')
    console.log(ctx.message.new_chat_members)
})

bot.on('left_chat_member', ctx => {
    console.log('left')
})


// 307537053
//utils.isInChat(307537053).then(r => console.log(r)).catch(e => console.log(e))
//utils.isInChat(307537313053).then(r => console.log(r)).catch(e => console.log('errrrr'))


module.exports = bot;