const express = require('express')
const {Router} = express
const ClaseProductos = require('./public/ClaseProductos.js')
const ClaseCarrito = require('./public/ClaseCarrito.js')

const app = express()

const productos = new ClaseProductos('./public/productos.txt')
const carritos = new ClaseCarrito('./public/carrito.txt')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const admin = true

const routerProductos = new Router()
const routerCarrito = new Router()

app.use(express.static('public'))

app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

routerProductos.use(express.json())
routerCarrito.use(express.json())

/* SECCION PARA LOS PRIDUCTOS */

routerProductos.get('/:id?', (req , res) => {
    let {id} = req.params
    const verificador = productos.getAll()
    if (verificador.length <= 0) {
        const error = (JSON.stringify({error:'No tiene ningun producto guardado'}))
        return res.send(error)
    } else {
        if (parseInt(id) > 0) {
            const producto = productos.getById(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
            res.send(productos.getById(id))
        } else {
            res.send(productos.getAll())
        }
    }
} )

routerProductos.post('/', (req , res) => {
    if (admin) {
        producto = req.body
        productos.saveProducto(producto)
        res.send(productos.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un POST'}))
        return res.send(error)
    }
})

routerProductos.put('/:id', (req , res) => {
    if (admin) {        
        let {id} = req.params
        const producto = productos.saveProductoById(id , req.body)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
        res.send(productos.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un PUT'}))
        return res.send(error)
    }
})

routerProductos.delete('/:id', (req , res) => {
    if (admin) {
        let {id} = req.params
        const producto = productos.deleteByIdNumber(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
        res.send(productos.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un DELETE'}))
        return res.send(error)
    }
})

/* SECCION PARA EL CARRITO */

routerCarrito.post('/', (req , res) => {
    let id = carritos.saveCarrito()
    res.send(`El ID del carrito es: ${id}`)
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