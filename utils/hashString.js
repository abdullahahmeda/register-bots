const bcrypt = require('bcryptjs')

/**
 * Returns a hashed string with `saltRounds` rounds
 * @param {string} s
 * @param {number|string} saltRounds
 * @returns {string}
 */
const hashString = (s, saltRounds) => {
  saltRounds = parseInt(saltRounds)
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(s, salt)
}

module.exports = hashString
