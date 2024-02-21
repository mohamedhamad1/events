require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const userRouter = require('./routes/user.route');
const eventRouter = require('./routes/event.route');
const dbconnect = require('./config/database');
const multer = require('multer');
const upload = multer({
    dest: '/uploads/images',

})

//start app
const app = express();
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//ejs template
app.set('view engine', 'ejs');

//static files
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('node_modules'));

//session and flash configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 15 }
}));
app.use(flash());

//passport setup
app.use(passport.initialize());
app.use(passport.session());
const passportSetup = require('./config/passport-setup')

app.get('*',(req,res,next) => {
    res.locals.user = req.user || null
    next();
})

app.get('/', (req, res) => {
    res.redirect('/events')
})

app.use('/events', eventRouter);
app.use('/users', userRouter);


app.all('*', (req, res) => {
    return res.render('notFound', {
        Title: 'Not Found',
    })
})

app.listen(4001, () => {
    console.log('listening on port', 4001);
})