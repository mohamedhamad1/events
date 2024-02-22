const User = require('../models/user.model');
const Event = require('../models/event.model');
const { validationResult } = require("express-validator");
const { get } = require('jquery');
const bcrypt = require('bcrypt');

const loginPage = async (req, res) => {
    res.render('user/login', {
        Title: 'Login',
        errors: req.flash('errors'),
        error: req.flash('error'),
        success: req.flash('succSignup'),
    })
}

const registerPage = async (req, res) => {
    res.render('user/register', {
        Title: 'Register',
        errors: req.flash('errors'),
        error: req.flash('error'),
        username: req.flash('username'),
        email: req.flash('email'),
    })
}

const registeration = async (req, res) => {
    try {
        const { username, email, password, confirm_password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (email) req.flash('email', email);
            if (username) req.flash('username', username);
            req.flash('errors', errors.array())
            return res.redirect('/users/register')
        }
        if (password !== confirm_password) {
            if (email) req.flash('email', email);
            if (username) req.flash('username', username);
            req.flash('error', 'Passwords do not match')
            return res.redirect('/users/register')
        }
        const userExisted = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });
        if (userExisted) {
            if (email) req.flash('email', email);
            if (username) req.flash('username', username);
            req.flash('error', 'User Already Exists')
            return res.redirect('/users/register')
        }
        const newUser = new User({
            username,
            email,
            password: await bcrypt.hash(password, 10),
        })
        await newUser.save();
        req.flash('succSignup', 'registration completed successfully')
        res.redirect('/users/login')
    } catch (error) {
        console.log(error);
    }
}

const editProfileInfo = async (req, res) => {
    try {
        const { username, email, password, new_password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('errors', errors.array())
            return res.redirect('/users/profile')
        }
        const oldPassword = await bcrypt.compare(password, req.user.password)
        if (!oldPassword) {
            req.flash('error', 'Wrong password')
            return res.redirect('/users/profile')
        }
        const userExisted = await User.findOne({
            $or: [
                { email, _id: { $ne: req.user.id } },
                { username, _id: { $ne: req.user.id } }
            ]
        });
        if (userExisted) {
            req.flash('error', 'Credentials already used')
            return res.redirect('/users/profile')
        }
        const updatedInfo = {
            username,
            email,
            password: new_password? await bcrypt.hash(new_password, 10):await bcrypt.hash(password, 10),
        }
        await User.updateOne({ _id: req.user.id }, { $set: { ...updatedInfo } })
        req.flash('success', 'User updated successfully')
        return res.redirect('/users/profile')
    } catch (error) {
        console.log(error);
    }
}
const profilePage = async (req, res) => {
    const limit = 3
    const page = req.query.page || 1
    const skip = limit * (page - 1)
    const count = await Event.countDocuments({user_id:req.user.id});
    let data = await Event.find({user_id:req.user.id}).skip(skip).limit(limit);
    let chunk = [];
    let chunkSize = 3;
    for (let i = 0; i < data.length; i += chunkSize) {
        chunk.push(data.slice(i, chunkSize + i));
    }
    let eventsFound = true;
    if(!chunk.length){
        eventsFound = false;
        req.flash('message', 'No events found')
    }
    res.render('user/profile', {
        Title: 'Profile',
        errors: req.flash('errors'),
        error: req.flash('error'),
        success: req.flash('success'),
        chunk,
        count,
        page,
        limit,
        eventsFound,
        eventsMessage:req.flash('message'),
    })

}

const deletAllMyEvents = async (req, res) => {
    try {
        await Event.deleteMany({user_id:req.user.id});
        req.flash('success', 'Events deleted successfully');
        res.json('/usres/profile')
    } catch (error) {
        console.log(error);
    }
}

const uploadAvatar = async (req, res) => {
    try {
        await User.updateOne({_id: req.user.id},{
            $set:{
                avatar: req.file.filename
            }
        })
        res.redirect('/users/profile')
    } catch (error) {
        console.log(error);
    }
}

const adminPanel = async (req, res) => {
    const eventLimit = 9
    const eventPage = req.query.eventPage || 1
    const eventSkip = eventLimit * (eventPage - 1)
    const eventCount = await Event.countDocuments();
    let events = await Event.find({}).skip(eventSkip).limit(eventLimit);
    let eventChunk = [];
    let eventChunkSize = 3;
    for (let i = 0; i < events.length; i += eventChunkSize) {
        eventChunk.push(events.slice(i, eventChunkSize + i));
    }
    const userLimit = 9
    const userPage = req.query.eventPage || 1
    const skip = userLimit * (userPage - 1)
    const userCount = await User.countDocuments({role:'USER'})
    let users = await User.find({role:'USER'}).skip(skip).limit(userLimit);
    let userChunk = [];
    let userChunkSize = 3;
    for (let i = 0; i < users.length; i += userChunkSize) {
        userChunk.push(users.slice(i, userChunkSize + i));
    }
    const admins = await User.find({role:'ADMIN'})
    const adminCount = admins.length
    res.render('admin/admin-panel', {
        Title: 'Admin Panel',
        eventChunk,
        eventCount,
        eventPage,
        eventLimit,
        userChunk,
        userCount,
        userPage,
        userLimit,
        admins,
        adminCount,
        message: eventChunk.length > 0 ? '' : 'No events added yet',
        success: req.flash('succCreate')
    });
}
const adminDeleteUser = async (req, res) => {
    try {
        await User.deleteOne({_id: req.params.id})
        res.redirect('/users/admin-panel')
    } catch (error) {
        console.log(error);
    }
}

const adminDeleteAllEvents = async(req, res)=>{
    try {
        await Event.deleteMany({})
        res.redirect('/users/admin-panel')
    } catch (error) {
        console.log(error);
    }
}

const adminDeleteAllUsers = async(req, res)=>{
    try {
        await User.deleteMany({_id:{ $ne :req.user.id}})
        res.redirect('/users/admin-panel')
    } catch (error) {
        console.log(error);
    }
}
const adminDeleteEvent = async (req, res) => {
    try {
        await Event.deleteOne({_id: req.params.id})
        res.redirect('/users/admin-panel')
    } catch (error) {
        console.log(error);
    }
}
const adminDeleteAdmin = async(req, res) => {
    try {
        await User.updateOne({_id: req.params.id},{
            $set:{
                role: 'USER'
            }
        })
        res.redirect('/users/admin-panel')
    } catch (error) {
        console.log(error);
    }
}
const adminMakeAdmin = async(req, res) => {
    console.log('route working');
    try {
        await User.updateOne({_id: req.params.id},{
            $set:{
                role: 'ADMIN'
            }
        })
        console.log('updated');
        res.redirect('/users/admin-panel')
    } catch (error) {
        console.log(error);
    }
}

const logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/users/login')
    })
}

module.exports = {
    loginPage,
    registeration,
    registerPage,
    profilePage,
    logout,
    editProfileInfo,
    deletAllMyEvents,
    uploadAvatar,
    adminPanel,
    adminDeleteEvent,
    adminDeleteUser,
    adminDeleteAllEvents,
    adminDeleteAllUsers,
    adminDeleteAdmin,
    adminMakeAdmin
}