const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true,
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now(),
    },
    user_id:{
        type: String,
        required: true,
    },
    user_name:{
        type: String,
        required: true,
    },
    user_avatar:{
        type: String,
        required: true,
    }
});
module.exports = mongoose.model('Event', eventSchema, 'events');