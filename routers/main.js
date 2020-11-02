const router = require('express').Router();
const RegisterController = require('../controllers/RegisterController');
const LoginController = require('../controllers/LoginController');
const utils = require('../utils');
const isLoggedIn = require('../middlewares/isLoggedIn')


router.get('/', async (req, res) => {
    return res.render('home');
})

router.get('/register', RegisterController.index)

router.post('/register', RegisterController.store);

router.get('/verify', RegisterController.verify);

router.get('/telegram_id', (req, res) => {
    return res.render('telegram_id');
})

router.get('/login', isLoggedIn, LoginController.index)
router.post('/login', isLoggedIn, LoginController.login)

module.exports = router;