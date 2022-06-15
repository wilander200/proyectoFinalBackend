const admin = require("firebase-admin");

const serviceAccount = require("../models/backendproyfinal-firebase-adminsdk-6ubw6-dcfc09c4b4.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('conectado a firebase correctamente')

const db = admin.firestore()

class ClaseCarrito {
    constructor (){
        this.newProducto = db.collection("carrito")
    }

    saveCarrito() {
        const contenido = fs.readFileSync(this.file, 'utf-8')
        let dato = JSON.parse(contenido);
        let id
        if (dato.length == 0 ) {
            id = 0;
        } else {
            id = dato[dato.length-1].id;
        }
        id++
        const timestamp = Date.now()
        dato.push({id: id, timestamp: timestamp, productos: this.newProducto})
        fs.writeFileSync(this.file , JSON.stringify(dato, null, 2), error => {
            if (error) {
                console.log("hubo un error al escribir el carrito")
            } else {
                console.log("se pudo crear el carrito correctamente")
            }
        }
        )
        return id
            }

    deleteCarritoById(id){
        const arrayProductos = fs.readFileSync(this.file, 'utf-8')
        let dato =  JSON.parse(arrayProductos);

        const pos = dato.findIndex(prod => prod.id === parseInt(id))
        if (pos < 0){
            return undefined
        }

        const findProduct = dato.filter(prod => prod.id !== parseInt(id))
        fs.writeFileSync(this.file , JSON.stringify(findProduct, null, 2), error => {
            if (error) {
                console.log("hubo un error al borrar")
            } else {
                console.log("se pudo borrar el item con el ID indicado")
            }
        }
        )
        return dato
    }

    getCarritoById(id) {
        const arrayCarritos = fs.readFileSync(this.file, 'utf-8')
            let dato =  JSON.parse(arrayCarritos);

            const pos = dato.findIndex(dat => dat.id === parseInt(id))
            if (pos < 0){
                return undefined
            }
            const findCarrito = dato.find(prod => prod.id === parseInt(id))
            return (findCarrito);
            }
    
    saveProductoInCarrito({id , producto}) {
        const contenido = fs.readFileSync(this.file, 'utf-8')

        let dato = JSON.parse(contenido);
        const pos = dato.findIndex(prod => prod.id === parseInt(id))

        if (pos < 0){
            return undefined
        }
        
        const findCarrito = dato.find(prod => prod.id === parseInt(id))
        const timestamp = findCarrito.timestamp

        this.newProducto.push(producto)

        const newCarrito = {id: parseInt(id), timestamp , productos: this.newProducto}
        dato.splice(pos, 1 , newCarrito)

        fs.writeFileSync(this.file , JSON.stringify(dato, null, 2), error => {
            if (error) {
                console.log("hubo un error al escribir el carrito")
            } else {
                console.log("se pudo crear el carrito correctamente")
            }
        }
        )
            }

    deleteProdInCarrito(id, id_prod){
        const arrayCarritos = fs.readFileSync(this.file, 'utf-8')
        let dato =  JSON.parse(arrayCarritos);

        const pos = dato.findIndex(prod => prod.id === parseInt(id))
        if (pos < 0){
            return undefined
        }

        const findCarrito = dato.filter(prod => prod.id == parseInt(id))
        const findProductos = findCarrito[0]
        const timestamp = findProductos.timestamp
        const deleteProduct = findProductos.productos

        const posProd = deleteProduct.findIndex(prod => prod.id === parseInt(id_prod))
        if (posProd < 0){
            return undefined
        }

        this.newProducto = deleteProduct.filter(prod => prod.id !== parseInt(id_prod))
        const newCarrito = {id: parseInt(id), timestamp , productos: this.newProducto}
        dato.splice(pos, 1 , newCarrito)

        fs.writeFileSync(this.file , JSON.stringify(dato, null, 2), error => {
            if (error) {
                console.log("hubo un error al borrar")
            } else {
                console.log("se pudo borrar el item con el ID indicado")
            }
        }
        )
        return dato
    }

}

module.exports = ClaseCarrito;