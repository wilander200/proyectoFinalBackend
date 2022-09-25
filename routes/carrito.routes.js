const {Router} = require('express')
const router = Router()
const controllerCar = require('../controller/carrito.js')


const admin = true

//CRUD DEL CARRITO

router.post('/api/carrito/', controllerCar.crearCar)
router.delete('/api/carrito/:id', controllerCar.deleteCar)
router.get('/api/carrito/:id/productos', controllerCar.carritoGet);

// CRUD DE LOS PRODUCTOS EN EL CARRITO

router.post('/api/carrito/:id/productos', controllerCar.guardarProdInCar)
router.delete('/api/carrito/:id/productos/:id_prod', controllerCar.deleteProdInCar)

//RUTAS PARA EL PAGO

router.post('/api/pago' , controllerCar.pagoPost)
router.get('/api/pago' , controllerCar.pagoGet)

module.exports = router;