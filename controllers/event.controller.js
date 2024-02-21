const Event = require('../models/event.model');
const { validationResult } = require("express-validator");
const { get } = require('jquery');
const Title = "Event";
const moment = require('moment');
const Comment = require('../models/comment.model');

const eventsHome = async (req, res) => {
    const limit = 9
    const page = req.query.page || 1
    const skip = limit * (page - 1)
    const count = await Event.countDocuments();
    let data = await Event.find({}).skip(skip).limit(limit);
    let chunk = [];
    let chunkSize = 3;
    for (let i = 0; i < data.length; i += chunkSize) {
        chunk.push(data.slice(i, chunkSize + i));
    }
    res.render('event/index', {
        Title: 'Events',
        chunk,
        count,
        page,
        limit,
        message: chunk.length > 0 ? '' : 'No events added yet',
        success: req.flash('succCreate')
    });
}

const showSingleEvent = async (req, res) => {
    const event = await Event.findOne({ _id: req.params.id });
    const comments = await Comment.find({event_id: req.params.id})
    res.render('event/show', {
        Title,
        event,
        success: req.flash('success'),
        comments,
    });
}

const createEventPage = async (req, res) => {
    const event = await Event.findOne({ _id: req.params.id })
    res.render('event/create', {
        Title: 'Create',
        errors: req.flash('errors'),
        title: req.flash('title'),
        description: req.flash('description'),
        location: req.flash('location'),
        date: req.flash('date'),
    });
}

const createEvent = async (req, res) => {
    try {
        const errors = validationResult(req);
        const { title, description, location, date } = req.body
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array())
            if (title) req.flash('title', title)
            if (description) req.flash('description', description)
            if (location) req.flash('location', location)
            if (date) req.flash('date', date)
            return res.redirect('/events/create')
        }
        const newEvent = new Event({
            title,
            description,
            location,
            date,
            user_id: req.user.id,
            user_name: req.user.username,
            user_avatar: req.user.avatar,

        })
        await newEvent.save();
        req.flash('succCreate', 'Event created successfully')
        res.redirect('/events')
    } catch (error) {

    }
}

const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await Event.findById(id)
        if (!event) {
            return res.json({ msg: 'event not found' })
        }
        await Event.deleteOne({ _id: id });
        res.json('deleted successfully')
    } catch (error) {
        console.log(error);
    }
}

const editEventPage = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
        if (!event) {
            return res.json({ msg: 'event not found' })
        }
        res.render('event/edit', {
            Title: 'Edit',
            errors: req.flash('errors'),
            title: event.title,
            description: event.description,
            location: event.location,
            date: moment(event.date).format('YYYY-MM-DD'),
            id: event._id
        });
    } catch (error) {
        console.log(error);
    }
}

const editEvent = async (req, res) => {
    const { title, description, location, date } = req.body;
    const id = req.params.id;
    const event = await Event.findById(id);
    if (!event) {
        return res.json({ msg: 'event not found' })
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array())
        return res.redirect('/events/edit/' + id)
    }
    const updatedEvent = {
        title,
        description,
        location,
        date,
    }
    await Event.updateOne({ _id: id }, { $set: { ...updatedEvent } });
    req.flash('success', 'Event updated successfully')
    res.redirect(`/events/${id}`);
}

const search = async (req, res) => {
    const limit = 9
    const page = req.query.page || 1
    const skip = limit * (page - 1)
    const searchTerm = req.query.search;
    const searchFiltered = searchTerm.replace(/[^a-zA-Z0-9]/g,"");
    let count = await Event.countDocuments({
        $or:[
            {title:{$regex: new RegExp(searchFiltered, 'i')}},
            {body:{$regex: new RegExp(searchFiltered, 'i')}},
            {user_name:{$regex: new RegExp(searchFiltered, 'i')}},
        ]
    });
    const data = await Event.find({
        $or:[
            {title:{$regex: new RegExp(searchFiltered, 'i')}},
            {body:{$regex: new RegExp(searchFiltered, 'i')}},
            {user_name:{$regex: new RegExp(searchFiltered, 'i')}},
        ]
    }).skip(skip).limit(limit);
    let chunk = [];
    let chunkSize = 3;
    for (let i = 0; i < data.length; i += chunkSize) {
        chunk.push(data.slice(i, chunkSize + i));
    }
    if(searchTerm == ''){
        chunk = [];
        count = 0;
    }
    res.render('event/search', {
        Title: 'Search',
        chunk,
        count,
        page,
        limit,
        message: chunk.length > 0 ? '' : 'No results found',
        searchTerm
    });
}
const commentOnEvent = async(req, res)=>{
    try {
        const {commentText} = req.body;
        const newComment = Comment({
            commentText,
            user_id: req.user.id,
            event_id: req.params.id,
            user_name: req.user.username,
            createdAt: moment(Date.now()).format('YYYY-MM-DD')
        })
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.redirect('/events/'+req.params.id)
    }
}
const deleteComment = async(req, res)=>{
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id)
        const eventId = comment.event_id;
        if (!comment) {
            return res.json({ msg: 'event not found' })
        }
        await Comment.deleteOne({ _id: id });
        res.redirect('/events/'+eventId)
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    createEventPage,
    createEvent,
    showSingleEvent,
    eventsHome,
    editEventPage,
    editEvent,
    deleteEvent,
    search,
    commentOnEvent,
    deleteComment
}   