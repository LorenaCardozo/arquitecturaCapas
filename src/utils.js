import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import jwt  from 'jsonwebtoken';
import { KEY_SECRET } from './config/config.js';
import { save } from "./controller/carts.controller.js";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const passportCall = (strategy) =>{
    
    return async(req, res, next)=>{
        passport.authenticate(strategy, { session: false }, function(err, user, info){
            if(err) return next(err); 
            if (!user){
                return res.status(401).send({error: info.messages?info.messages:info.toString()});
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};
export const authorization = () => {

    return async(req, res, next)=> {
        if(!req.user) return res.status(401).send({error:"Unauthorizes"})
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

        if (!req.user.cart)
        {
             // Agregar el carrito a req para que esté disponible en getAll
            req.user.cart = await save();
        }
        //console.log("AQUI RESULTADO", req.user)
        next();

    } catch (error) {
        // Manejar errores si la búsqueda del carrito falla
        console.error('Error al cargar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

