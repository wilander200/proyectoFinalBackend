const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const ClassUserMDB = require('../api/ClaseUsuariosMDB.js')
const ServidorMensajeria = require('../../utils/mensajeria.js')

const userClass = new ClassUserMDB()
const msjNodemailer = new ServidorMensajeria()

//SERIALIZAR Y DESERIALIZAR

passport.serializeUser(function(user, done) {
    done(null, user.username)
  })
  
  passport.deserializeUser(async function(username, done) {
    const usuarios = await userClass.getAll()
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario)
  })

//  REGISTRO DEL USUARIO

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
}, async (req, username, password, done) => {
    const users = await userClass.getAll()
    const usuario = users.find(usuario => usuario.username == username)
    if (usuario) {
        return done ()
    }

    const newUser = {
        username, 
        password: await userClass.encryptPassword(password),
        user: req.body.user,
        address: req.body.address,
        age: req.body.age,
        phonenumber: req.body.phonenumber,
        avatar: req.body.avatar
    }
    const asunto = `Registro de nuevo usuario ${username}`

    await msjNodemailer.nodemailerGmailRegistro({asunto, newUser})
    
    await userClass.saveUser(newUser)
    
    return done(null, newUser)
}))

// LOGIN DE USUARIO 

passport.use('login', new LocalStrategy(async (username, password, done) => {

    const usuarios = await userClass.getAll()
    const userLog = usuarios.find(usuario => usuario.username == username)
    if (!userLog) {
        return done(null, false)
    }

    const match = await userClass.matchPassword(password, userLog.password)

    if (!match) {
        return done(null, false)
    }
    
    userClass.contador = 0

    return done(null,userLog)
}))