import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { KEY_SECRET, MAIL, MAIL_PASS } from './config/config.js';
import { save } from "./controller/carts.controller.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const passportCall = (strategy) => {

    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};
export const authorization = () => {

    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorizes" })
        next();
    }
}

export const authorizationUser = () => {

    return async (req, res, next) => {
        if (!req.user || req.user.role !== 'user') return res.status(401).send({ error: "Unauthorizes" })
        next();
    }
}

export const authorizationAdmin = () => {

    return async (req, res, next) => {
        if (!req.user || req.user.role !== 'admin') return res.status(401).send({ error: "Unauthorizes" })
        next();
    }
}

const secretKey = KEY_SECRET;

// Función para generar un token JWT
export const generarToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Puedes personalizar el tiempo de expiración
}

// Middleware para cargar el carrito del usuario
export async function loadCart(req, res, next) {
    try {

        if (!req.user.cart) {
            // Agregar el carrito a req para que esté disponible en getAll
            req.user.cart = await save();
        }

        next();

    } catch (error) {
        // Manejar errores si la búsqueda del carrito falla
        console.error('Error al cargar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

import nodemailer from 'nodemailer';

export function enviarCorreo(destinatario, asunto, contenido) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', 
        port:587,
        auth: {
            user: MAIL, 
            pass: MAIL_PASS, 
        },
    });

    const mailOptions = {
        from: MAIL,
        to: destinatario,
        subject: asunto,
        text: contenido,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}
