const { query, json } = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("../models/backendproyfinal-firebase-adminsdk-6ubw6-dcfc09c4b4.json");
const { discriminators } = require("../models/productos");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('conectado a firebase correctamente')

const db = admin.firestore()

class ClaseCarrito {
    constructor (){
        this.carrito = db.collection("carrito")
        this.newProducto = []
    }

    
    async saveCarrito() {
        let dato = await (await this.carrito.get()).docs
        let id
        if (dato.length == 0 ) {
            id = 0;
        } else {
            id = dato[dato.length-1].id;
        }
        id++
        const timestamp = Date.now()
        let doc = await this.carrito.doc(id.toString())
        await doc.create({timestamp: timestamp, productos: this.newProducto})
        console.log(id)
        return id
            }

    async deleteCarritoById(id){
        let dato = await this.carrito.doc(id).get()
        await this.carrito.doc(id).delete()
        return (dato.data());
    }

    async getCarritoById(id) {
        let dato = await this.carrito.doc(id).get()
        return (dato.data());
    }
    
    async saveProductoInCarrito({id , producto}) {
        this.newProducto.push(producto)

        await this.carrito.doc(id).update({productos: this.newProducto})
        
        let dato = await this.carrito.doc(id).get()
        return (dato.data());
            }

    async deleteProdInCarrito(id, id_prod){
        let productoBorrado = this.newProducto.filter(prod => prod.id !== parseInt(id_prod))
        await this.carrito.doc(id).update({productos: productoBorrado})
        
        return
    }

}

module.exports = ClaseCarrito;