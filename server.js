const express = require('express')
const path = require('path')
const nunjucks = require('nunjucks')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const session = require('express-session')
const flash = require('connect-flash')

const SequelizeStore = require('connect-session-sequelize')(session.Store)

// Use .env file
require('dotenv').config()

const mainRouter = require('./routers/main')
const adminRouter = require('./routers/admin')

const bot = require('./bot')
const injectIpAddress = require('./middlewares/injectIpAddress')

// Init the epxress app
const app = express()

// Use sessions
const sessionStore = new SequelizeStore({
  db: require('./models').sequelize
})

app.use(session({
  secret: process.env.APP_SECRET,
  saveUninitialized: false,
  store: sessionStore,
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}))
sessionStore.sync()

// Use cookeis
app.use(cookieParser(process.env.APP_SECRET))

// Use parser
app.use(express.urlencoded({ extended: false }))

// Use CSRF
app.use(csrf({ cookie: true }))

// Use flash messages
app.use(flash())

// Expose flash messages to views
app.use((req, res, next) => {
  res.locals.flash = req.flash()
  res.locals._csrf = req.csrfToken()
  res.locals.reqPath = req.path
  res.locals.user = req.session.user
  res.locals.env = process.env
  res.locals.getDate = function (date) {
    return date.toISOString().split('T')[0]
  }
  next()
})

app.use(injectIpAddress)

// Launch the bot
bot.launch()

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Use routes
app.use('/custom-admin', adminRouter)
app.use(mainRouter)

// Use nunjucks template engine
app.set('view engine', 'html')
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
})

const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`)
})
