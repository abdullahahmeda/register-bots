const router = require('express').Router();
const RegisterController = require('./controllers/RegisterController');
const utils = require('./utils');

router.get('/', async (req, res) => {
    return res.render('home');
})

router.get('/register', async (req, res) => {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();

    const country = await utils.getCountry(ip);
    return res.render('register', {
        country
    })
})

router.post('/register', RegisterController.store);

router.get('/verify', RegisterController.verify);

router.get('/telegram_id', (req, res) => {
    return res.render('telegram_id');
})

module.exports = router;