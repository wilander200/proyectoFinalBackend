const mongoose = require('mongoose')

const userCollection = 'usersProyFinal'

const UsersSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    user: {type: String, required: true},
    address: {type: String, required: true},
    age: {type: Number, required: true},
    phonenumber: {type: Number, required: true},
    avatar: {type: String, required: true},
})

module.exports = mongoose.model(userCollection, UsersSchema)