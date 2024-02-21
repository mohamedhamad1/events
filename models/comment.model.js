const mongoose = require('mongoose');
const commentSchema = mongoose.Schema({
    commentText:{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    user_name:{
        type: String,
        required: true
    },
    upvotes:{
        type: Number,
        default: 0
    },
    event_id:{
        type: String,
        required: true
    },
    createdAt:{
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Comment',commentSchema,'comments')