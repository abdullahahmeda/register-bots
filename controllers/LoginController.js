const User = require('../models').User;
var bcrypt = require('bcryptjs');
const userLoginSchema = require('../validation/userLoginSchema');

module.exports = {
    index: function(req, res) {
        return res.render('login');
    },
    login: async function(req, res) {
        delete req.body._csrf;

        const { error , value } = userLoginSchema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            req.flash('message', 'الرجاء إدخال بريد إلكتروني وكلمة مرور صالحتين');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/tgadminlogin-123321ems');
        }

        const user = await User.findOne({
            where: {
                email: value.email,
                status: 'active'
            }
        });
        if (user == null) {
            req.flash('message', 'البيانات المدخلة غير صحيحة');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/tgadminlogin-123321ems');
        }

        if (!bcrypt.compareSync(value.password, user.password)) {
            req.flash('message', 'كلمة المرور غير صحيحة');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/tgadminlogin-123321ems');
        }

        delete user.password;
        req.session.user = user;

        return res.redirect('/custom-admin');
    }
}