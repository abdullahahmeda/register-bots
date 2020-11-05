const router = require('express').Router();
const RegisterController = require('../controllers/RegisterController');
const LoginController = require('../controllers/LoginController');
const utils = require('../utils');
const isLoggedIn = require('../middlewares/isLoggedIn');
const bodyParser = require('body-parser');


router.get('/', async (req, res) => {
    return res.render('home');
})

router.get('/register', RegisterController.index)

router.post('/register', RegisterController.store);

router.get('/verify/:token', function(req, res, next) {
    res.locals.token = req.params.token;
    res.locals.groupUrl = process.env.TELEGRAM_CHAT_LINK;
    next();
}, RegisterController.verifyGet);
router.post('/verify/:token', bodyParser.json(), RegisterController.verifyPost);

router.get('/telegram_id', (req, res) => {
    return res.render('telegram_id');
})

router.get('/login', isLoggedIn, LoginController.index)
router.post('/login', isLoggedIn, LoginController.login)

module.exports = router;