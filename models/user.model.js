const mongoose  = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        required: true,
        default: 'profile.jpg',
    },role:{
        type: String,
        required: true,
        default: 'USER'
    }
});
userSchema.methods.hashPass = (password) => {
    return bcrypt.hash(password,10)
}

userSchema.methods.comparePass = (password,hash) => {
    return bcrypt.compare(password,hash)
}
module.exports = mongoose.model('User',userSchema, 'users');
