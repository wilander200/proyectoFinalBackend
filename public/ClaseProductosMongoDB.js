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

    getById(id) {
        const findProduct = models.productos.find({id: parseInt(id)})
            return (findProduct);
            }

    getAll() {
        const getAllProductos = function(cb){ 
            models.productos.find({}).exec(function (err, docs) { 
            docs.reverse()
            cb(err, docs);
          })
    }
        getAllProductos(function(err, productos){
            if (err) {return res.status(500).send({error: err})}
            return productos
        })
    }

    saveProducto({name, description, codigo, price, stock, thumbnail}) {
        const dato = this.getAll();
        console.log('el dato',dato);
        let id
        if (dato.length == 0 ) {
            id = 0;
        } else {
            id = dato[dato.length-1].id;
        }
        id++
        const timestamp = Date.now()
        const nuevoProducto = new models.productos({id: id, 
            timestamp: timestamp,  
            name: name, 
            description: description, 
            codigo: codigo, 
            price: price, 
            stock: stock, 
            thumbnail: thumbnail}).save()

        console.log("se pudo usar el SaveObject correctamente")
        return nuevoProducto;
    }

        saveProductoById(id, {name, description, codigo, price, stock, thumbnail}) {
            const timestamp = Date.now()
            const productoUpdate = models.productos.updateOne({id: parseInt(id)} , 
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

    deleteByIdNumber(id){
        const borrarProducto = models.productos.deleteOne({id: parseInt(id)})
        console.log('Producto borrado correctamente')
        return borrarProducto;
        }
}

module.exports = ClaseProductos;

