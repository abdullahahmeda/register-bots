const User = require('../models').User;
const adminSchema = require('../validation/adminSchema');
const bcrypt = require('bcryptjs');

module.exports = {
    index: function(req, res) {
        return res.render('admin/index.html');
    },

    edit: function(req, res) {
        return res.render('admin/settings');
    },

    update: async function(req, res) {
        delete req.body._csrf;

        const { error , value } = adminSchema.validate(req.body, {
            abortEarly: false
        });

        if (error) {
            const errors = {};
            error.details.forEach(elm => {
                const path = elm.path[0];
                errors[path] = elm.message
            })
    
            req.flash('errors', errors);
            req.flash('old', req.body);
            return res.redirect('/admin/settings')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value.password, salt);

        try {
            await User.update({
                name: value.name,
                telegramId: value.telegramId,
                email: value.email,
                password: hash
            }, {
                where: {
                    id: req.session.user.id
                }
            })
            req.session.user = {
                ...req.session.user,
                ...value
            }
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                req.flash('message', 'هذا الايميل أو معرف التليجرام مستخدم من قبل مستخدم آخر');
                req.flash('type', 'danger');
                req.flash('old', req.body);
                return res.redirect('/admin/settings');
            }
        }

        req.flash('message', 'تم تحديث بياناتك بنجاح');
        req.flash('type', 'success');
        return res.redirect('/admin/settings')
    },

    logout: function(req, res) {
        req.session.user = null;
        return res.redirect('/');
    }
}