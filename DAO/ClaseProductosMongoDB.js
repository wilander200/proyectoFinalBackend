const mongoose = require("mongoose");
const models = require("../models/productos.js")
const dotenv = require('dotenv').config()
const logger = require('../utils/logger.js')
const tranfProdDto = require('../DTO/productos.js')

ReadFromDB();

async function ReadFromDB() {

    try {
        const URL = process.env.URL_PRODUCTOS_MONGODB

        let conection = await mongoose.createConnection(URL)
        logger.info('Conexion a base de datos de productos OK')

        return
    } catch (error) {
        logger.error(`${error} conexion a la base de datos de productos`)
    }
}

class ClaseProductos {
    constructor (){
        
    }

    async getById(id) {
        const findProduct = await models.productos.find({id: parseInt(id)})
            return tranfProdDto(findProduct);
            }

    async getAll() {
        const productos = await models.find()
        return tranfProdDto(productos)
    }

    async saveProducto({name, description, codigo, price, stock, thumbnail}) {
        const dato = await this.getAll();
        let id
        if (dato.length == 0 ) {
            id = 0;
        } else {
            id = dato[dato.length-1].id;
        }
        id++
        const timestamp = Date.now()
        const nuevoProducto = await models.create({id: id, 
            timestamp: timestamp,  
            name: name, 
            description: description, 
            codigo: codigo, 
            price: price, 
            stock: stock, 
            thumbnail: thumbnail})

        logger.info("se pudo guardar el producto correctamente")
        return tranfProdDto(nuevoProducto);
    }

    async saveProductoById(id, {name, description, codigo, price, stock, thumbnail}) {
            const timestamp = Date.now()

            const dato = await this.getAll()
            const pos = dato.findIndex(prod => prod.id === parseInt(id))
            if (pos < 0){
                return undefined
            }
//
            const productoUpdate = await models.updateOne({id: parseInt(id)} , 
            {$set: {timestamp: timestamp,  
                name: name , 
                description: description, 
                codigo: codigo,  
                price: price , 
                stock: stock,  
                thumbnail: thumbnail}})

            logger.info('se actualizo el producto correctamente')
            return tranfProdDto(productoUpdate)
        }

    async deleteByIdNumber(id){
        const dato = await this.getAll()
            const pos = dato.findIndex(prod => prod.id === parseInt(id))
            if (pos < 0){
                return undefined
            }
        const borrarProducto = await models.deleteOne({id: parseInt(id)})
        logger.info('Producto borrado correctamente')
        return tranfProdDto(borrarProducto);
        }
}

module.exports = ClaseProductos;

