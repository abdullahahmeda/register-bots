module.exports = function isLoggedIn(req, res, next) {
    if (req.session.user != null) {
        return res.redirect('/admin');
    }
    next();
}