const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const session = require('express-session');
const flash = require('connect-flash');

const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Use .env file
require('dotenv').config();

const mainRouter = require('./routers/main');
const adminRouter = require('./routers/admin');
const bot = require('./bot');

// Init the epxress app
const app = express();

// Use sessions
/* const sessionStore = new SequelizeStore({
    db: require('./models').sequelize,
}) */

app.use(session({
    secret: process.env.APP_SECRET,
    saveUninitialized: false,
    store: sessionStore,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));
sessionStore.sync();

// Use cookeis
app.use(cookieParser(process.env.APP_SECRET))

// Use body parser
app.use(bodyParser.urlencoded({ extended: false }))

//Use CSRF
app.use(csrf({ cookie: true }))

// Use flash messages
app.use(flash());

// Expose flash messages to views
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    res.locals._csrf = req.csrfToken();
    res.locals.reqPath = req.path;
    res.locals.user = req.session.user;
    res.locals.getDate = function(date) {
        return date.toISOString().split('T')[0];
    }
    next();
})

// Init the bot
//bot.launch();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/custom-admin', adminRouter);
app.use(mainRouter)

app.set('view engine', 'html')

// Use nunjucks template engine
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});


const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})