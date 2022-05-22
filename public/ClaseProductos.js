const fs = require("fs");

class ClaseProductos {
    constructor (file){
        this.file = file;
    }

    saveObject(name, description, codigo, price, stock, thumbnail) {
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo asignado");
            } else {
                let dato = JSON.parse(contenido);
                let id
                if (contenido.length == 0 ) {
                    id = 0;
                } else {
                    id = dato[dato.length-1].id;
                }
                id++
                const fecha = new Date()
                const date = fecha.toLocaleDateString()
                const hora = fecha.toLocaleTimeString()
                const timestamp = {fecha , hora}
                dato.push({id: id, timestamp: timestamp,  name: name, description: description, codigo: codigo, price: price, stock: stock, thumbnail: thumbnail})
                fs.writeFile(this.file , JSON.stringify(dato, null, 2), error => {
                    if (error) {
                        console.log("hubo un error al escribir")
                    } else {
                        console.log("se pudo usar el SaveObject correctamente")
                    }
                }
                )
            }
        })
    }

    getById(id) {
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo");
            } else {
                let dato =  JSON.parse(contenido);
                const findProduct = dato.find(prod => prod.id === id)
                console.log(findProduct);
            }
        })
    }

    getAll(cb) {
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo");
            } else {
                let dato =  JSON.parse(contenido);
                cb(dato)
            }
        })
    }

    deleteByIdNumber(id){
        fs.readFile(this.file, 'utf-8', (error, contenido)=>{
            if (error) {
                console.log("hubo un error en la lectura del archivo");
            } else {
                let dato =  JSON.parse(contenido);
                const findProduct = dato.filter(prod => prod.id !== id)
                fs.writeFile(this.file , JSON.stringify(findProduct, null, 2), error => {
                    if (error) {
                        console.log("hubo un error al escribir")
                    } else {
                        console.log("se pudo borrar el item con el ID indicado")
                    }
                }
                )
            }
        })
    }

    }


module.exports = ClaseProductos;

