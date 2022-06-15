const express = require('express')
const {Router} = express
//import ClaseProductos from './public/ClaseProductos.js'
//import ClaseCarrito from './public/ClaseCarrito.js'
const ClaseProductosMongoDB= require('./public/ClaseProductosMongoDB.js')
const ClaseCarritoFirebase = require('./public/CLaseCarritoFirebase.js')

const app = express()

//const productos = new ClaseProductos('./public/productos.txt')
//const carritos = new ClaseCarrito('./public/carrito.txt')

const productosMDB = new ClaseProductosMongoDB();
const carritoFB = new ClaseCarritoFirebase()

app.use(express.urlencoded({extended: true}))
//app.use(express.json())

const admin = true

const routerProductos = new Router()
const routerCarrito = new Router()

app.use(express.static('public'))

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

routerProductos.use(express.json())
routerCarrito.use(express.json())

/* SECCION PARA LOS PRODUCTOS */

routerProductos.get('/:id?', async function(req , res) {
    let {id} = req.params
    //const verificador = productos.getAll()
    const verificador = await productosMDB.getAll()
    if (verificador.length <= 0) {
        const error = (JSON.stringify({error:'No tiene ningun producto guardado'}))
        return res.send(error)
    } else {
        if (parseInt(id) > 0) {
            //const producto = productos.getById(id)
            const producto = await productosMDB.getById(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
            //res.send(productos.getById(id))
            res.jsonp(await productosMDB.getById(id))
        } else {
            //res.send(productos.getAll())
            res.jsonp(await productosMDB.getAll())
        }
    }
} )

routerProductos.post('/', async (req , res) => {
    if (admin) {
        const producto = req.body
        //productos.saveProducto(producto)
        await productosMDB.saveProducto(producto)
        //res.send(productos.getAll())
        res.jsonp(await productosMDB.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un POST'}))
        return res.send(error)
    }
})

routerProductos.put('/:id', async (req , res) => {
    if (admin) {        
        let {id} = req.params
        //const producto = productos.saveProductoById(id , req.body)
        const producto = await productosMDB.saveProductoById(id , req.body)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
        //res.send(productos.getAll())
        res.jsonp(await productosMDB.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un PUT'}))
        return res.send(error)
    }
})

routerProductos.delete('/:id', async (req , res) => {
    if (admin) {
        let {id} = req.params
        //const producto = productos.deleteByIdNumber(id)
        const producto = await productosMDB.deleteByIdNumber(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
        //res.send(productos.getAll())
        res.jsonp( await productosMDB.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un DELETE'}))
        return res.send(error)
    }
})

/* SECCION PARA EL CARRITO */

routerCarrito.post('/', async (req , res) => {
    //let id = carritos.saveCarrito()
    let id = await carritoFB.saveCarrito()
    res.send(`El ID del carrito es: ${id}`)
})

routerCarrito.delete('/:id', async (req , res) => {
        let {id} = req.params
        //const carrito = carritos.deleteCarritoById(id)
        const carrito = await carritoFB.deleteCarritoById(id)
        if (carrito === undefined) {
            const error = (JSON.stringify({error:'Carrito no encontrado'}))
            return res.send(error)
        }
        res.send(`Se elimina el carrito con el ID: ${id}`)
})

routerCarrito.get('/:id/productos', async (req , res) => {
    let {id} = req.params
    if (parseInt(id) > 0) {
        //const producto = carritos.getCarritoById(id)
        const producto = await carritoFB.getCarritoById(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Carrito no encontrado'}))
            return res.send(error)
        }
        //res.send(carritos.getCarritoById(id))
        res.jsonp(await carritoFB.getCarritoById(id))
    } else {
        res.send(`No se puede colocar un ID menor o igual a cero (0)`)
    }
});

routerCarrito.post('/:id/productos', async (req , res) => {
        let {id} = req.params
        let producto = req.body
        if (parseInt(id) > 0) {
            const carrito = await carritoFB.getCarritoById(id)
            if (carrito === undefined) {
                const error = (JSON.stringify({error:'Carrito no encontrado'}))
                return res.send(error)
            }
            //carritos.saveProductoInCarrito({id, producto})
            await carritoFB.saveProductoInCarrito({id, producto})
            //res.send(carritos.getCarritoById(id))
            res.jsonp(await carritoFB.getCarritoById(id))
        } else {
            res.send(`No se puede colocar un ID de carrito menor o igual a cero (0)`)
        }
        
})

routerCarrito.delete('/:id/productos/:id_prod', async (req , res) => {
    let {id , id_prod} = req.params
    //const carrito = carritos.deleteProdInCarrito(id , id_prod)
    const carrito = await carritoFB.getCarritoById(id)
    if (carrito === undefined) {
        const error = (JSON.stringify({error:'Carrito no encontrado en el carrito'}))
        return res.send(error)
    }
    await carritoFB.deleteProdInCarrito(id , id_prod)
    res.send(`Se elimina el producto con ID: ${id_prod}, del carrito con el ID: ${id}`)
})

/* CONTROL DEL ERROR DE LA RUTA */

app.use((req, res) => {
    res.status(404).send({error: "Error 404", descripcion: "Ruta no admitida"})
})

const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log('servidor http escuchando en el puerto ' + PORT)
})

server.on('error', error => console.log(`Error en servidor ${error}`))