const nodemailer = require('nodemailer')
const { getMaxListeners } = require('../models/user')
const dotenv = require('dotenv').config()
const logger = require('./logger.js')
const twilio = require('twilio')


const emailAdmin = process.env.EMAIL_GMAIL_NODEMAILER
const passGmail = process.env.KEY_GMAIL_NODEMAILER
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const adminPhone = process.env.ADMIN_PHONE_NUMBER
const adminCellphone = process.env.ADMIN_CELL_PHONE


class ServidorMensajeria {
    constructor() {

    }

    async nodemailerGmailRegistro({asunto, newUser}) {

        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: emailAdmin,
                pass: passGmail
            }
        })
        
        logger.info('Enviando email de registro de usuario')
        
        const info = await transporter.sendMail({
            from: emailAdmin,
            to: [emailAdmin , newUser.username],
            subject: asunto,
            text: JSON.stringify({ mensaje: 'Resgistrado correctamente',
                email: newUser.username, 
                password: newUser.password, 
                nombre: newUser.user,
                direccion: newUser.address,
                edad: newUser.age,
                telefono: newUser.phonenumber,
                foto: newUser.avatar,
            }),
        })
        
        logger.info('Mensaje con el registro del usuario enviado enviado')
    }

    async twilioSMSCarrito ({user, phonenumber}){
        const twilioClient = twilio(accountSid, authToken)

        const from = adminPhone
        const to = `+${phonenumber}`
        const body = `Estimado ${user}, tu pedido se ha recibido y se esta procesando en este momento`

        const info = await twilioClient.messages.create({body, from, to})

        logger.info('SMS enviado al cliente')
    }

    async twilioWhatsappCarrito ({user, username, phonenumber}) {
        const twilioClient = twilio(accountSid, authToken)

        const mensaje = `Nuevo pedido de ${user} email: ${username}`

        const message = await twilioClient.messages.create({
            body: mensaje,
            to: `whatsapp:+${phonenumber}`,
            from: `whatsapp:${adminCellphone}`,
        })
        
        logger.info('se envió el whatsapp al administrador correctamente')
    }

    async nodemailerGmailCarrito({productos, username, user}) {

        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: emailAdmin,
                pass: passGmail
            }
        })
        
        logger.info('Enviando email con los productos del carrito')
        
        const info = await transporter.sendMail({
            from: emailAdmin,
            to: [emailAdmin , username],
            subject: `Nuevo pedido de ${user} email: ${username}`,
            text: JSON.stringify(productos),
        })
        
        logger.info('Email con el pedido enviado al administrador')
    }
}

module.exports = ServidorMensajeria;