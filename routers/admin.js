const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const utils = require('../utils');
const isAdmin = require('../middlewares/isAdmin');
const AdminUsersController = require('../controllers/AdminUsersController');
const AdminBlacklistController = require('../controllers/AdminBlacklistController');

router.use(isAdmin);

router.get('/', AdminController.index)
router.get('/users', AdminUsersController.index)
router.post('/users/:telegramId/ban', AdminUsersController.ban)
router.delete('/users/:telegramId', AdminUsersController.destroy)


router.get('/blacklist', AdminBlacklistController.index)
router.get('/blacklist/create', AdminBlacklistController.create)
router.post('/blacklist', AdminBlacklistController.store)
router.delete('/blacklist/:emailId', AdminBlacklistController.destroy)

module.exports = router;