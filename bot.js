const Telegraf = require('telegraf');
const utils = require('./utils');
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
    username: process.env.TELEGRAM_BOT_USERNAME
});
const User = require('./models').User;

const chatId = process.env.TELEGRAM_CHAT_ID;

/* bot.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log('Response time: %sms', ms)
  }) */

/* bot.on('new_chat_members', async (ctx) =>  {
    
    if (ctx.message.chat.id == chatId) {
        console.log('new chat member')
        const newMembers = ctx.message.new_chat_members;

        for (const member of newMembers) {
            const user = await User.findOne({
                where: {
                    telegramId: member.id,
                    status: 'active'
                }
            })
            if (user == null) {
                await utils.denyUserToSendMessages(member.id);
                console.log('denied user')
            }
            else {
                await utils.allowUserToSendMessages(member.id);
                console.log('allowed user');
            }
        }
    }
}) */

bot.on('text', async (ctx) => {
    if (ctx.update.message.chat.type === 'private') {
        ctx.reply(`
        للدخول لمجموعة الخدمات الطبية الطارئة

اتبع التالي:

1- انسخ رقم معرف التليجرام: ${ctx.update.message.from.id}

2-سجّل لك عضوية من الرابط التالي:
www.eemsr.com/tgc`);
    }
    else if (ctx.update.message.chat.id == chatId) {
        const messageId = ctx.update.message.message_id;
        const telegramId = ctx.update.message.from.id;

        const user = await User.findOne({
            where: {
                telegramId,
                status: 'active'
            }
        })

        if (user == null) {
            await utils.deleteGroupMessage(messageId);
        }
    }
})

/* bot.on('left_chat_member', ctx => {
    console.log('left')
}) */


module.exports = bot;