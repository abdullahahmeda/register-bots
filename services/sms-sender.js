require('dotenv').config()
const fetch = require('node-fetch')

function sendVerifySMS (to, body) {
  const url = `http://www.oursms.net/api/sendsms.php?username=${
    process.env.SMS_API_USERNAME
  }&password=${
    process.env.SMS_API_PASSWORD
  }&numbers=${to}&message=${encodeURIComponent(body)}&sender=${
    process.env.SMS_API_SENDER
  }&unicode=E&return=json`

  fetch(url)
    .then((res) => res.text())
    .then((message) => console.log(message))
    .catch((e) => console.log(e))
}

module.exports = sendVerifySMS
