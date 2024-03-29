const router = require('express').Router()
const RegisterController = require('../controllers/RegisterController')
const LoginController = require('../controllers/LoginController')
const isLoggedIn = require('../middlewares/isLoggedIn')
const express = require('express')

router.get('/tgc', RegisterController.index)

router.get('/tgr', RegisterController.index)

router.post('/tgr', RegisterController.store)

router.get('/verify/:token', function (req, res, next) {
  res.locals.token = req.params.token
  res.locals.groupUrl = process.env.TELEGRAM_CHAT_LINK
  next()
}, RegisterController.verifyGet)
router.post('/verify/:token', express.json(), RegisterController.verifyPost)

router.get('/telegram_id', (req, res) => {
  return res.render('telegram_id')
})

router.get('/tgadminlogin-123321ems', isLoggedIn, LoginController.index)
router.post('/tgadminlogin-123321ems', isLoggedIn, LoginController.login)

module.exports = router
