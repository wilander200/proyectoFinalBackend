const mongoose = require("mongoose");

const productosCollection = 'productos'

const productosSchema = new mongoose.Schema({
    id: {type: Number, required: true},
    timestamp: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    codigo: {type: String, required: true},
    thumbnail: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
})

module.exports = mongoose.model(productosCollection, productosSchema)