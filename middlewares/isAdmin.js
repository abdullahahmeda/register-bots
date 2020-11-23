module.exports = function isAdmin(req, res, next) {
    if (req.session.user == null) {
        return res.redirect('/tgadminlogin-123321ems');
    }
    if (req.session.user.role !== 'admin') {
        return res.redirect('/tgadminlogin-123321ems');
    }
    next();
}