const BannedEmail = require('../models').BannedEmail;

module.exports = {
    index: async function(req, res) {
        emails = await BannedEmail.findAll();
        return res.render('admin/blacklist/index', {
            emails
        });
    },

    create: function(req, res) {
        return res.render('admin/blacklist/create');
    },

    store: async function(req, res) {
        delete req.body.csrf;
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(req.body.address).toLowerCase())) {
            req.flash('message', 'بريد الكتروني غير صالح');
            req.flash('type', 'danger');
            return res.redirect('/custom-admin/blacklist/create');
        }
        try {
            await BannedEmail.create(req.body);
            req.flash('message', 'تم إضافة البريد الالكتروني بنجاح');
            req.flash('type', 'success');
        }
        catch(e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                req.flash('message', 'هذا الايميل في الايميلات المحظورة بالفعل');
                req.flash('type', 'danger');
                return res.redirect('/custom-admin/blacklist/create');
            }
        }
        return res.redirect('/custom-admin/blacklist');
    },

    destroy: async function(req, res) {
        const emailId = req.params.emailId;
        await BannedEmail.destroy({
            where: {
                id: emailId
            }
        });

        return res.json({
            status: '1',
            message: 'تم حذف الايميل بنجاح'
        })
    }
}