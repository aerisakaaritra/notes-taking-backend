const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('user', UserSchema)
// User.createIndexes() //one time require only while creating unique index. later it gets saved in db itself
module.exports = User