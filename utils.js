const fetch = require('node-fetch');
const telegram = require('./telegram')

async function getCountry(ip) {
    return new Promise((resolve, reject) => {
        fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${ip}`)
        .then(res => res.json())
        .then(json => resolve(json.country_code2))
        .catch(e => reject(e));
    })
}

function sendVerifySMS(to, text) {
    
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

module.exports = {
    getCountry,
    sendVerifySMS,
    isInChat
}
