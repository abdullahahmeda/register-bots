const router = require('express').Router()
const AdminController = require('../controllers/AdminController')
const isAdmin = require('../middlewares/isAdmin')
const AdminUsersController = require('../controllers/AdminUsersController')
const AdminBlacklistController = require('../controllers/AdminBlacklistController')

router.use(isAdmin)

router.get('/', AdminController.index)
router.get('/settings', AdminController.edit)
router.post('/settings', AdminController.update)

router.get('/users', AdminUsersController.index)
router.post('/users/:telegramId/ban', AdminUsersController.ban)
router.post('/users/:telegramId/verify', AdminUsersController.verify)
router.delete('/users/:telegramId', AdminUsersController.destroy)

router.get('/blacklist', AdminBlacklistController.index)
router.get('/blacklist/create', AdminBlacklistController.create)
router.post('/blacklist', AdminBlacklistController.store)
router.delete('/blacklist/:emailId', AdminBlacklistController.destroy)

router.post('/logout', AdminController.logout)

module.exports = router
