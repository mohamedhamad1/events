const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const User = require('../models/user.model')
const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');

// save user in session
passport.serializeUser(async (user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user)
})

//login
passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passportField: 'password',
    passReqToCallback: true,
},
    async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email: email })
            if (!user) {
                return done(null, false, req.flash('error', 'Invalid credentials'));
            }
            const unhashedPass = await bcrypt.compare(password,user.password)
            if(!unhashedPass){
                return done(null, false, req.flash('error', 'Invalid credentials'));
            }
            done(null, user, req.flash('succLogin', 'Welcome back'))
        } catch (error) {
            console.log(error);
        }
    }
))
