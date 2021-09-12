/**
 * Checks whether `x` is `null` or `undefined`
 * @param {*} x
 * @returns {boolean}
 */
const isNil = (x) => x === null || x === undefined

const makeToken = () => Math.random().toString(36).substr(2)

const makeCode = () => Math.random().toString(10).slice(2, 8)

exports.isNil = isNil
exports.makeToken = makeToken
exports.makeCode = makeCode
