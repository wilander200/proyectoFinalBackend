const express = require('express')
const cors = require('cors')
const { Server: HttpServer } = require('http')
const dotenv = require('dotenv').config()
const handlebars = require('express-handlebars')
const logger = require('./utils/logger.js')
require('./services/passport/autenticacion.js')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo');
const parseArgs = require('minimist')
const cluster = require('cluster')
const os = require('os')


//DATOS EN DOTENV

const urlSession = process.env.URL_SESSION_MONGODB
const secretWord = process.env.SESSION_SECRETWORD

//CONFIGURACION DEL MINIMIST Y CLUSTER

const options = {
    alias: { p: 'PORT' , m: 'MODO'},
    default: {PORT: 8080 , MODO: 'fork'}
}
const {PORT} = process.env.PORT || parseArgs(process.argv.slice(2), options)
const {MODO} = parseArgs(process.argv.slice(3), options)

if ((MODO == 'cluster') && cluster.isPrimary) {
    
    const nCpus = os.cpus().length
    logger.info('Gererando el servidor en modo cluster con: ' + nCpus + 'CPUs')

    for (let i = 0; i < nCpus; i++) {
        cluster.fork() } 
        cluster.on('exit', worker => { logger.info('Worker ' + process.pid + ' murio') 
        cluster.fork() }) 
} else {

    //Midelwares

    const app = express()
    app.use(cors())
    const httpServer = new HttpServer(app)
    app.use(express.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(express.json())
    app.use(cookieParser())

    //DECLARANDO EL MOTOR DE VISUALIZACION 

    app.engine('handlebars', handlebars.engine({
        extname: ".handlebars",
        defaultLayout: 'index.handlebars',
    }))
    app.set('views', './public/views')
    app.set('view engine', 'handlebars')

    // SESSION 

    const advancedOptions = { useNewUrlParser: true , useUnifiedTopology: true}

    app.use(session({
        store: MongoStore.create({
            mongoUrl: urlSession,
            mongoOptions:advancedOptions
        }),
        secret: secretWord,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000
        }
    }))

    //MIDELWARES

    app.use(passport.initialize())
    app.use(passport.session())

    /* ROUTES */

    app.use(require('./routes/productos.routes.js'))
    app.use(require('./routes/carrito.routes.js'))
    app.use(require('./routes/index.routes.js'))

    /* CONTROL DEL ERROR DE LA RUTA */

    app.use((req, res) => {
        res.status(404).send({error: "Error 404", descripcion: "Ruta no encontrada"})
    })

    //CONFIGURANDO EL PUERTO DE ESCUCHA DEL SERVIDOR

    httpServer.listen(PORT, () => {
        logger.info('servidor http escuchando en el puerto ' + PORT)
    })
    }