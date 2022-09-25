const ApiCarrito = require('../DAO/CLaseCarritoFirebase')
const ServidorMensajeria = require('../services/mensajeria/mensajeria.js')
const ClassUserMDB = require('../DAO/ClaseUsuariosMDB.js')

const MSJ = new ServidorMensajeria()
const carritoFB = new ApiCarrito
const userClass = new ClassUserMDB()


const admin = true

//FUNCIONES PARA EL CARRITO

const crearCar = async (req , res) => {
    let id = await carritoFB.saveCarrito()
    req.session.passport.id = id
    res.redirect(`/api/carrito/${id}/productos`)
}

const deleteCar = async (req , res) => {
        let {id} = req.params
        const carrito = await carritoFB.deleteCarritoById(id)
        if (carrito === undefined) {
            const error = (JSON.stringify({error:'Carrito no encontrado'}))
            return res.send(error)
        }
        res.send(`Se elimina el carrito con el ID: ${id}`)
}

const carritoGet = async (req , res) => {
    let {id} = req.params
    if (parseInt(id) > 0) {
        const producto = await carritoFB.getCarritoById(id)
        if (producto === undefined) {
            const error = (JSON.stringify({error:'Carrito no encontrado'}))
            return res.send(error)
        }
        const carrito =await carritoFB.getCarritoById(id)
        const prod = carrito.productos
        req.session.passport.productos = prod
        res.render('carrito', {
            producto: prod,
            productoTrue: prod.length
        })
    } else {
        res.send(`No se puede colocar un ID menor o igual a cero (0)`)
    }
};

//FUNCIONES PARA PRODUCTOS EN EL CARRITO

const guardarProdInCar = async (req , res) => {
        let {id} = req.params
        let producto = req.body
        if (parseInt(id) > 0) {
            const carrito = await carritoFB.getCarritoById(id)
            if (carrito === undefined) {
                const error = (JSON.stringify({error:'Carrito no encontrado'}))
                return res.send(error)
            }
            await carritoFB.saveProductoInCarrito({id, producto})
            res.jsonp(await carritoFB.getCarritoById(id))
        } else {
            res.send(`No se puede colocar un ID de carrito menor o igual a cero (0)`)
        }
        
}

const deleteProdInCar = async (req , res) => {
    let {id , id_prod} = req.params
    const carrito = await carritoFB.getCarritoById(id)
    if (carrito === undefined) {
        const error = (JSON.stringify({error:'Carrito no encontrado en el carrito'}))
        return res.send(error)
    }
    await carritoFB.deleteProdInCarrito(id , id_prod)
    res.send(`Se elimina el producto con ID: ${id_prod}, del carrito con el ID: ${id}`)
}

//PAGO

const pagoPost = async (req, res) => {
        res.redirect('/api/pago')
}

const pagoGet = async (req, res) => {
    const username = req.session.passport.user
    const usuarios = await userClass.getAll()
    const userLog = usuarios.find( usr => usr.username == username)
    const user = userLog.user
    const phonenumber = userLog.phonenumber

    const id = req.session.passport.id
    const productos = req.session.passport.productos
    
    await MSJ.twilioSMSCarrito({user, phonenumber})
    await MSJ.twilioWhatsappCarrito({user, username, phonenumber})
    await MSJ.nodemailerGmailCarrito({productos, user, username})

    res.render('pago', {
        user: userLog.user
    })
}

module.exports = {
    crearCar,
    deleteCar,
    carritoGet,
    guardarProdInCar,
    deleteProdInCar,
    pagoPost,
    pagoGet
}