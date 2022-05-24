const fs = require("fs");
const { domainToASCII } = require("url");

class ClaseCarrito {
    constructor (file){
        this.file = file;
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
        dato.push({id: id, timestamp: timestamp})
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


    //getById(id) {
    //    const arrayProductos = fs.readFileSync(this.file, 'utf-8')
    //        let dato =  JSON.parse(arrayProductos);
//
    //        const pos = dato.findIndex(prod => prod.id === parseInt(id))
    //        if (pos < 0){
    //            return undefined
    //        }
//
    //        const findProduct = dato.find(prod => prod.id === parseInt(id))
    //        return (findProduct);
    //        }
//
    //getAll() {
    //    const arrayProductos = fs.readFileSync(this.file, 'utf-8')
    //    let dato =  JSON.parse(arrayProductos);
    //    return dato
    //}
//
    //saveProducto({name, description, codigo, price, stock, thumbnail}) {
    //    const contenido = fs.readFileSync(this.file, 'utf-8')
    //    let dato = JSON.parse(contenido);
    //    let id
    //    if (dato.length == 0 ) {
    //        id = 0;
    //    } else {
    //        id = dato[dato.length-1].id;
    //    }
    //    id++
    //    const timestamp = Date.now()
    //    dato.push({id: id, timestamp: timestamp,  name: name, description: description, codigo: codigo, price: price, stock: stock, thumbnail: thumbnail})
    //    fs.writeFileSync(this.file , JSON.stringify(dato, null, 2), error => {
    //        if (error) {
    //            console.log("hubo un error al escribir")
    //        } else {
    //            console.log("se pudo usar el SaveObject correctamente")
    //        }
    //    }
    //    )
    //        }
//
    //    saveProductoById(id, {name, description, codigo, price, stock, thumbnail}) {
    //        const arrayProductos = fs.readFileSync(this.file, 'utf-8')
    //        let dato =  JSON.parse(arrayProductos);
//
    //        const pos = dato.findIndex(prod => prod.id === parseInt(id))
    //        if (pos < 0){
    //            return undefined
    //        }
//
    //        const timestamp = Date.now()
    //        const nuevoProducto = {id: parseInt(id) , timestamp: timestamp,  name , description, codigo,  price , stock,  thumbnail}
    //        dato.splice(pos, 1 , nuevoProducto)
    //        fs.writeFileSync(this.file , JSON.stringify(dato, null, 2), error => {
    //            if (error) {
    //                console.log("hubo un error al escribir")
    //            } else {
    //                console.log("se pudo usar el SaveObject correctamente")
    //            }
    //        }
    //        )
    //        return dato
//
    //    }
//
    //deleteByIdNumber(id){
    //    const arrayProductos = fs.readFileSync(this.file, 'utf-8')
    //        let dato =  JSON.parse(arrayProductos);
//
    //        const pos = dato.findIndex(prod => prod.id === parseInt(id))
    //        if (pos < 0){
    //            return undefined
    //        }
//
    //        const findProduct = dato.filter(prod => prod.id !== parseInt(id))
    //        fs.writeFileSync(this.file , JSON.stringify(findProduct, null, 2), error => {
    //            if (error) {
    //                console.log("hubo un error al borrar")
    //            } else {
    //                console.log("se pudo borrar el item con el ID indicado")
    //            }
    //        }
    //        )
    //        return dato
    //    }
}

module.exports = ClaseCarrito;