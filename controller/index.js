const passport = require('passport')
require('../services/passport/autenticacion.js')
const upload = require('../services/multer/storage.js')


// FUNCION DE AUTENTICACION 

const autenticacion = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/login')
    }
}

//INICIO 

const inicio =  (req, res) => {
    res.redirect('/api/productoS')
}

//REGISTER

const avatar = upload.single('avatar')

const passportRegistro = passport.authenticate('register', {
    failureRedirect: '/api/errorRegistro', 
    successRedirect: '/api/login'})

const errorRegistro =  async (req, res) => {
    res.render('errorRegistro' , {})
}

const getRegistro = (req, res) => {
    res.render('registro' , {})
}

//LOGIN

const passportLogin = passport.authenticate('login', {
    failureRedirect: '/api/errorLogin', 
    successRedirect: '/api/productos'})

const getLogin = (req , res) => {
    res.render('login' , {})
}

const errorLogin = (req, res) => {
    res.render('errorLogin' , {})
}

//lOGOUT

const logout = async (req, res) => {
    await req.session.destroy(err => {
        if (err) {
            res.json({error: 'olvidar', descripcion: err})
        } else {
            res.render('logout' , {
            })
        }
    })
}

module.exports = {
    autenticacion,
    inicio,
    avatar,
    passportRegistro,
    errorRegistro,
    getRegistro,
    passportLogin,
    getLogin,
    errorLogin,
    logout
}