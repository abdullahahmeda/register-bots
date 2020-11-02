const userRegisterSchema = require('../validation/userRegisterSchema');
const User = require('../models').User;
const utils = require('../utils');
const telegram = require('../telegram');
const BannedEmail = require('../models').BannedEmail;

module.exports = {

    index: async function (req, res) {
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    
        const country = await utils.getCountry(ip);
        return res.render('register', {
            country
        })
    },


    store: async function(req, res) {
        delete req.body._csrf;
        const { error , value } = userRegisterSchema.validate(req.body, {
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
            return res.redirect('/register');
        }
    
        try {
            value.ipAddress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
            await User.create(value);
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                if (e.errors[0].path === 'email') {
                    req.flash('message', 'الايميل مستخدم بالفعل');
                }
                if (e.errors[0].path === 'phone') {
                    req.flash('message', 'رقم الهاتف مستخدم بالفعل');
                }
                if (e.errors[0].path === 'telegramId') {
                    req.flash('message', 'معرف التلجرام مستخدم بالفعل');
                }
                
                req.flash('type', 'danger');
                req.flash('old', req.body);
                return res.redirect('/register');
            }
        }

        // Check if email is banned
        const bannedEmail = await BannedEmail.findOne({
            where: {
                address: value.email
            }
        });

        if (bannedEmail != null) {
            req.flash('message', 'هذا الايميل محظور');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/register');
        }

        // Verify user on telegram
        try {
            const userTelegram = await telegram.getChatMember(value.telegramId, value.telegramId);
        }
        catch (e) {
            req.flash('message', 'معرف التلجرام غير صحيح');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/register');
        }
        

        //sendVerifySMS('201064290265');
    
        return res.end();
    },

    verify: function(req, res) {
        return res.render('verify');
    }

}
