const {Router} = require('express')
const router = Router()
const controllerIdx = require('../controller/index.js')
require('../services/passport/autenticacion.js')
const controllerProd = require('../controller/productos.js')

router.get('/api/productos/:id?',controllerIdx.autenticacion , controllerProd.productosGet)
router.post('/api/productos', controllerProd.productosPost)
router.put('/api/productos/:id', controllerProd.productosPut)
router.delete('/api/productos/:id', controllerProd.productosDelete)

module.exports = router