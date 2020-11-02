module.exports = function isAdmin(req, res, next) {
    if (req.session.user == null) {
        return res.redirect('/login');
    }
    if (req.session.user.role !== 'admin') {
        return res.redirect('/login');
    }
    next();
}