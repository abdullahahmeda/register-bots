module.exports = function injectIpAddress (req, res, next) {
  req.ipAddress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()
  next()
}
