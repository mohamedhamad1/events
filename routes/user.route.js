const userController = require('../controllers/user.controller')
const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const eventController = require('../controllers/event.controller');
const passport = require('passport');
const isAuthenticated = require('../middlewares/isAuthenticated')
const allowedTo = require('../middlewares/allowedTo')
//login routers
router.route('/login')
    .get(userController.loginPage)
    .post(
        passport.authenticate('local.login', {
            successRedirect: '/users/profile',
            failureRedirect: '/users/login',
            failureFlash: true,
        }),
    );

//register routes
router.route('/register')
    .get(userController.registerPage)
    .post([
        check('username').isLength({ min: 1 }).withMessage('username is required'),
        check('password').isLength({ min: 1 }).withMessage('password is required'),
        check('confirm_password').isLength({ min: 1 }).withMessage('password confirmation is required'),
        check('email').isLength({ min: 1 }).withMessage('email is required'),
    ], userController.registeration);

//profile routes
router.route('/profile')
    .get(isAuthenticated, userController.profilePage)
    .post([
        check('username').isLength({ min: 1 }).withMessage('username is required'),
        check('password').isLength({ min: 1 }).withMessage('password is required'),
        check('email').isLength({ min: 1 }).withMessage('email is required'),
    ], isAuthenticated, userController.editProfileInfo)
    .delete(isAuthenticated, userController.deletAllMyEvents)

//admin-panel routes
router.route('/admin-panel')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminPanel)

//admin-panel delete user routes
router.route('/admin-panel/deleteUsers')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminDeleteAllUsers)

//admin-panel delete event routes
router.route('/admin-panel/deleteEvents')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminDeleteAllEvents)
//admin-panel delete user routes
router.route('/admin-panel/deleteUsers/:id')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminDeleteUser)

//admin-panel delete event routes
router.route('/admin-panel/deleteEvents/:id')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminDeleteEvent)

//admin-panel delete event routes
router.route('/admin-panel/deleteAdmin/:id')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminDeleteAdmin)

//admin-panel delete event routes
router.route('/admin-panel/makeAdmin/:id')
    .get(isAuthenticated, allowedTo('ADMIN','ROOT'), userController.adminMakeAdmin)

//logout route
router.route('/logout')
    .get(isAuthenticated, userController.logout)


module.exports = router; 
