module.exports = (req, res, next) => {
  if (!req.session) throw Error('Session is required for flash messages to work')
  req.flash = _flash
  next()
}

function _flash (type, msg) {
  const msgs = this.session.flash || {}
  if (arguments.length === 0) return msgs
  else if (arguments.length === 1) return msgs[type]
  else {
    msgs[type] = msg
    this.session.flash = Object.assign({}, msgs)
  }
}
