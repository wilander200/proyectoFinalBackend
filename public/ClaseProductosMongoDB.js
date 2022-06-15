const mongoose = require("mongoose");
const models = require("../models/productos.js")

ReadFromDB();

async function ReadFromDB() {

    try {
        const URL = 'mongodb+srv://wilander200:Wilander.200@cluster0.pw5qlwv.mongodb.net/ecommerce?retryWrites=true&w=majority'

        let conection = await mongoose.connect(URL)
        console.log('Conexion OK')

        return
    } catch (error) {
        console.log(error)
    }
}

class ClaseProductos {
    constructor (){
        
    }

    async getById(id) {
        const findProduct = await models.productos.find({id: parseInt(id)})
            return (findProduct);
            }

    async getAll() {
        const productos = await models.find()
        return productos
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

        console.log("se pudo usar el SaveObject correctamente")
        return nuevoProducto;
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

            console.log('se actualizo el producto correctamente')
            return productoUpdate
        }

    async deleteByIdNumber(id){
        const dato = await this.getAll()
            const pos = dato.findIndex(prod => prod.id === parseInt(id))
            if (pos < 0){
                return undefined
            }
        const borrarProducto = await models.deleteOne({id: parseInt(id)})
        console.log('Producto borrado correctamente')
        return borrarProducto;
        }
}

module.exports = ClaseProductos;

