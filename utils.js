const fetch = require('node-fetch');

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

module.exports = {
    getCountry,
    sendVerifySMS
}