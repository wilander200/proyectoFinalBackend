const express = require('express')
const session = require('express-session')
const {Router} = require('express')
const router = Router()
const passport = require('passport')
require('../src/passport/autenticacion.js')
const upload = require('../src/multer/storage.js')


// FUNCION DE AUTENTICACION 

function autenticacion (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/api/login')
    }
}

//RUTA DE INICIO 

router.get('/' , autenticacion, (req, res) => {
    res.redirect('/api/productoS')
})


//REGISTER

router.post('/api/registro', upload.single('avatar'), passport.authenticate('register', {
    failureRedirect: '/api/errorRegistro', 
    successRedirect: '/api/login'}))

router.get('/api/errorRegistro', async (req, res) => {
    res.render('errorRegistro' , {})
})

router.get('/api/registro', (req, res) => {

    res.render('registro' , {})
})

//LOGIN

router.post('/api/login' , passport.authenticate('login', {
    failureRedirect: '/api/errorLogin', 
    successRedirect: '/api/productos'}))

router.get('/api/login', (req , res) => {
    res.render('login' , {})
})

router.get('/api/errorLogin',(req, res) => {
    res.render('errorLogin' , {})
})

//lOGOUT

router.post('/api/logout' , async (req, res) => {
    await req.session.destroy(err => {
        if (err) {
            res.json({error: 'olvidar', descripcion: err})
        } else {
            res.render('logout' , {
            })
        }
    })
})

module.exports = router;