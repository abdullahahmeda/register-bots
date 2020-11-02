const User = require('../models').User;
var bcrypt = require('bcryptjs');
const userLoginSchema = require('../validation/userLoginSchema');

module.exports = {
    index: function(req, res) {
        return res.render('login');
    },
    login: async function(req, res) {
        delete req.body.csrf;

        const { error , value } = userLoginSchema.validate(req.body, {
            abortEarly: false
        });

        const users = await User.findAll({
            where: {
                email: value.email
            }
        });
        if (users.length === 0) {
            const errors = {};
            error.details.forEach(elm => {
                const path = elm.path[0];
                errors[path] = elm.message
            })
    
            req.flash('message', 'البيانات المدخلة غير صحيحة');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/login');
        }

        const user = users[0];
        if (!bcrypt.compareSync(value.password, user.password)) {
            req.flash('message', 'كلمة المرور غير صحيحة');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/login');
        }

        delete user.password;
        req.session.user = user;

        return res.redirect('/admin');
    }
}