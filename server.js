const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

// Use .env file
require('dotenv').config();

const routes = require('./routes');
const sequelize = require('./db');
const bot = require('./bot');

// Init the epxress app
const app = express();

// Use body parser
app.use(bodyParser.urlencoded({ extended: false }))

// Use sessions
app.use(session({
    secret: process.env.APP_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 60000 }
}));

// Use flash messages
app.use(flash());

// Expose flash messages to views
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    next();
})

// Connect to DB
sequelize
.authenticate()
.then(() => console.log('Connected to DB'))
.catch(e => console.log(e))

// Init the bot
bot.launch();

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use(routes)

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