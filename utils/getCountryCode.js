const fetch = require('node-fetch')

/**
 * Returns the country code from an IP address
 * 
 * @async
 * @param {string} ip IP address of the client
 * @returns {string}
 */
async function getCountryCode(ip) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${ip}`
    )
      .then((res) => res.json())
      .then((json) => resolve(json.country_code2))
      .catch((e) => reject(e))
  })
}

module.exports = getCountryCode;
