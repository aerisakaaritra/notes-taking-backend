const mongoose = require('mongoose')
const mongoURI = 'mongodb://127.0.0.1:27017/notebook'

const connectToDB = () =>{
    mongoose
    .connect(mongoURI)
    .then(() => console.log('Connected to the mongoDB database'))

}

module.exports = connectToDB