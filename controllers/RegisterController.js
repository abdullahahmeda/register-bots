const userSchema = require('../validation/userSchema');
const User = require('../models/User');
const { sendVerifySMS } = require('../utils');

module.exports = {

    index: async function (req, res) {
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
    
        const country = await utils.getCountry(ip);
        return res.render('register', {
            country
        })
    },


    store: async function(req, res) {
        const { error , value } = userSchema.validate(req.body, {
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
            await User.create(value);
        }
        catch (e) {
            req.flash('message', 'رقم الهاتف أو الايميل مستخدم بالفعل');
            req.flash('type', 'warning');
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
