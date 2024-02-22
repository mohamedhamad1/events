require('dotenv').config()
const Event = require('./models/event.model');
const User = require('./models/user.model');
const dbconnect  =  require('./config/database')
for (let i = 1; i <= 50; i++) {
    const newUser = new Event({
        title:`event ${i}`,
        description:`event ${i} description`,
        location:'egypt',
        date: Date.now(),
        user_id:'111'
    })
    newUser.save();
}