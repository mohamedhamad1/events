const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const eventController = require('../controllers/event.controller')
const isAuthenticated = require('../middlewares/isAuthenticated')
const eventAuth = require('../middlewares/eventAuth')


//home routes
router.route('/')
    .get(eventController.eventsHome)

//create event routes
router.route('/create')
    .get(isAuthenticated,eventController.createEventPage)
    .post(isAuthenticated,[
        check('title').isLength({ min: 1 }).withMessage('title must be at least 1 characters'),
        check('description').isLength({ min: 1 }).withMessage('description must be at least 1 characters'),
        check('location').isLength({ min: 1 }).withMessage('location must be at least 1 characters'),
        check('date').isDate().withMessage('date must be valid date'),
    ], eventController.createEvent);

//edit event routes
router.route('/edit/:id')
    .get(isAuthenticated,eventController.editEventPage)
    .post(isAuthenticated,[
        check('title').isLength({ min: 1 }).withMessage('title must be at least 1 characters'),
        check('description').isLength({ min: 1 }).withMessage('description must be at least 1 characters'),
        check('location').isLength({ min: 1 }).withMessage('location must be at least 1 characters'),
        check('date').isDate().withMessage('date must be valid date'),
    ], eventController.editEvent);

    //edit event routes
router.route('/delete/:id')
    .delete(isAuthenticated,eventController.deleteEvent)

//search
router.route('/search')
    .get(eventController.search)

router.route('/deleteComment/:id')
    .get(isAuthenticated,eventController.deleteComment)

//show single event routes
router.route('/:id')
    .get(eventController.showSingleEvent)
    .post(eventController.commentOnEvent)

module.exports = router;