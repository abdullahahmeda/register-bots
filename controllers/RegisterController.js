const userRegisterSchema = require('../validation/userRegisterSchema');
const User = require('../models').User;
const utils = require('../utils');
const telegram = require('../telegram');
const VerificationCode = require('../models').VerificationCode;
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
            return res.redirect('/tgr');
        }

        if (value.speciality === 'غير ذلك') {
            value.speciality = value.other_speciality
        }
        delete value.other_speciality;

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
            return res.redirect('/tgr');
        }

        // Verify user on telegram
        try {
            const userTelegram = await telegram.getChatMember(value.telegramId, value.telegramId);
            //console.log(userTelegram)
        }
        catch (e) {
            req.flash('message', 'معرف التلجرام غير صحيح');
            req.flash('type', 'danger');
            req.flash('old', req.body);
            return res.redirect('/tgr');
        }
    
        let user;
        try {
            value.ipAddress = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
            user = await User.create(value);
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
                return res.redirect('/tgr');
            }
        }

        const code = Math.random().toString(10).slice(2,8);
        const token = Math.random().toString(36).substr(2);
        try {
            await VerificationCode.create({
                token,
                code,
                userId: user.id
            });
        }
        catch(e) {
            /* req.flash('type', 'danger');
            req.flash('old', req.body); */
        }

        utils.sendVerifySMS(`966${value.phone.slice(1)}`, `كود التفعيل الخاص بك هو: ${code}.`);
    
        return res.redirect('/verify/' + token);
    },

    verifyGet: function(req, res) {
        return res.render('verify');
    },

    verifyPost: async function(req, res) {
        const token = req.params.token;
        const code = req.body.code;
        
        const row = await VerificationCode.findOne({
            where: {
                token,
                code
            }
        });
        if (row == null) {
            return res.json({
                status: '0',
                message: 'هذا الكود غير صحيح'
            });
        }

        try {
            await User.update({
                verifiedAt: new Date(),
                status: 'active'
            }, {
                where: {
                    id: row.userId
                }
            })

            await VerificationCode.destroy({
                where: {
                    token,
                    code
                }
            })
        }
        catch (e) {
            return res.json({
                status: '0',
                message: 'حدث خطأ أثناء التفعيل، الرجاء إعادة المحاولة'
            });
        }

        return res.json({
            status: '1',
            message: 'تم التفعيل بنجاح'
        });
        
    },


}
