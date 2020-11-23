const fetch = require('node-fetch');
const telegram = require('./telegram');
const twilio = require('twilio');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function getCountry(ip) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${ip}`)
        .then(res => res.json())
        .then(json => resolve(json.country_code2))
        .catch(e => reject(e));
    })
}

function sendVerifySMS(to, body) {
    /* client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER
    }).then(message => console.log(message)).catch(e => console.log(e)); */

    fetch(`https://api-server3.com/api/send.aspx?username=${process.env.SMS_API_USERNAME}&password=${process.env.SMS_API_PASSWORD}&language=2&sender=${process.env.SMS_API_SENDER}&mobile=${to}&message=${decodeURIComponent(body)}`)
        .then(res => res.json())
        .then(message => console.log(message))
        .catch(e => console.log(e));
}

async function isInChat(telegramId) {
    try {
        const user = await telegram.getChatMember(process.env.TELEGRAM_CHAT_ID, telegramId);
        return user.status === 'member';
    }
    catch(e) {
        return false;
    }
}

async function allowUserToSendMessages(telegramId) {
    try {
        const s = await telegram.restrictChatMember(process.env.TELEGRAM_CHAT_ID, telegramId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_other_messages: true
        })
        console.log('updated ' , s);
        return true;
    }
    catch(e) {
        console.log(e)
        return false;
    }
}

async function denyUserToSendMessages(telegramId) {
    try {
        const s = await telegram.restrictChatMember(process.env.TELEGRAM_CHAT_ID, telegramId, {
            can_send_messages: false,
            can_send_media_messages: false,
            can_send_other_messages: false
        })
        console.log('updated ' , s);
        return true;
    }
    catch(e) {
        console.log(e)
        return false;
    }
}

async function deleteGroupMessage(messageId) {
    try {
        await telegram.deleteMessage(process.env.TELEGRAM_CHAT_ID, messageId);
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

module.exports = {
    getCountry,
    sendVerifySMS,
    isInChat,
    allowUserToSendMessages,
    denyUserToSendMessages,
    deleteGroupMessage,
}
