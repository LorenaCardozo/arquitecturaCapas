import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { KEY_SECRET, MAIL, MAIL_PASS } from '../config/config.js';
import { save } from "../controller/carts.controller.js";

export const __filename = fileURLToPath(import.meta.url);
const parentDir = dirname(__filename);
//export const __dirname = dirname(__filename);
export const __dirname = join(parentDir, '..');

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

export const authorizationPremium = () => {
    return async (req, res, next) => {
        try {
            if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'premium')) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            // ID del producto de los parámetros de la URL
            const productId = req.params.id;

            // Busco el producto en la base
            const product = await ProductModel.findById(productId);

            if (!product) {
                return res.status(404).json({ error: "Producto no encontrado" });
            }

            // Verifico si el usuario es un administrador o un usuario premium,
            // y si el owner del producto coincide con el usuario actual
            if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === req.user.email.toString())) {
                next();
            } else {
                return res.status(403).json({ error: "No tienes permiso para eliminar este producto" });
            }
        } catch (error) {
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    };
};

const secretKey = KEY_SECRET;

// Función para generar un token JWT
export const generarToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
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
import ProductModel from '../dao/mongo/models/products.models.js';

export function enviarCorreo(destinatario, asunto, contenido) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
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

export function enviarCorreoHtml(destinatario, asunto, contenido) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 587,
        auth: {
            user: MAIL,
            pass: MAIL_PASS,
        },
    });

    const mailOptions = {
        from: MAIL,
        to: destinatario,
        subject: asunto,
        html: contenido,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}

export function generateResetToken(email) {
    const payload = {
        email: email,
    };
    const secretKey = KEY_SECRET;
    const options = {
        expiresIn: '1h', // Establece el tiempo de expiración del token
    };

    return jwt.sign(payload, secretKey, options);
}

// Verifica un token de restablecimiento de contraseña
export function verifyResetToken(token) {
    const secretKey = KEY_SECRET;
    try {
        const payload = jwt.verify(token, secretKey);
        return payload.email;
    } catch (error) {
        return null; // El token es inválido o ha expirado
    }
}