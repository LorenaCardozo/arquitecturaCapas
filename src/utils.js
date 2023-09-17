import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import jwt  from 'jsonwebtoken';
import { KEY_SECRET } from './config/config.js';


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

