const { isNil } = require('../utils/helpers')

module.exports = function isAdmin (req, res, next) {
  console.log(req.session.user)
  if (isNil(req.session.user)) {
    return res.redirect('/tgadminlogin-123321ems')
  }
  if (req.session.user.role !== 'admin') {
    return res.redirect('/tgadminlogin-123321ems')
  }
  next()
}
