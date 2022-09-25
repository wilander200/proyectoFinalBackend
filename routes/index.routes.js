const {Router} = require('express')
const router = Router()
const controllerIdx = require('../controller/index.js')

//RUTA DE INICIO 

router.get('/' , controllerIdx.autenticacion, controllerIdx.inicio)

//REGISTER

router.post('/api/registro',controllerIdx.avatar, controllerIdx.passportRegistro)
router.get('/api/errorRegistro', controllerIdx.errorRegistro)
router.get('/api/registro', controllerIdx.getRegistro)

//LOGIN

router.post('/api/login' , controllerIdx.passportLogin)
router.get('/api/login', controllerIdx.getLogin)
router.get('/api/errorLogin',controllerIdx.errorLogin)

//lOGOUT

router.post('/api/logout' , controllerIdx.logout)

module.exports = router;