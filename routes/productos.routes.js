const { toArray } = require('cluster/lib/utils.js')
const {Router} = require('express')
const router = Router()
const passport = require('passport')
require('../src/passport/autenticacion.js')
const ApiProductos= require('../src/api/ClaseProductosMongoDB.js')

const productosMDB = new ApiProductos();

function autenticacion (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/login')
    }
}

const admin = true

router.get('/api/productos/:id?', autenticacion ,async function(req , res) {
    let {id} = req.params
    const verificador = await productosMDB.getAll()
    if (verificador.length <= 0) {
        const error = (JSON.stringify({error:'No tiene ningun producto guardado'}))
        return res.send(error)
    } else {
        if (parseInt(id) > 0) {
            const producto = await productosMDB.getById(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
            const prod = await productosMDB.getById(id)
            res.render('home', {
                producto: prod,
                productoTrue: prod.length})
        } else {
            const prod = await productosMDB.getAll()
            res.render('home', {
                producto: prod,
                productoTrue: prod.length})
        }
    }
} )

router.post('/api/productos', async (req , res) => {
    if (admin) {
        const producto = req.body
        await productosMDB.saveProducto(producto)
        res.jsonp(await productosMDB.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un POST'}))
        return res.send(error)
    }
})

router.put('/api/productos/:id', async (req , res) => {
    if (admin) {        
        let {id} = req.params
        const producto = await productosMDB.saveProductoById(id , req.body)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
        res.jsonp(await productosMDB.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un PUT'}))
        return res.send(error)
    }
})

router.delete('/api/productos/:id', async (req , res) => {
    if (admin) {
        let {id} = req.params
        const producto = await productosMDB.deleteByIdNumber(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Producto no encontrado'}))
            return res.send(error)
        }
        res.jsonp( await productosMDB.getAll())
    } else {
        const error = (JSON.stringify({error:'401' , descripcion: 'El usuario no posee los permisos para accesder a la direccion /api/productos y realizar un DELETE'}))
        return res.send(error)
    }
})

module.exports = router