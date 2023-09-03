import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import jwt  from 'jsonwebtoken';
import * as dotenv from "dotenv";

dotenv.config();

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
        console.log(req.user)
        if(!req.user) return res.status(401).send({error:"Unauthorizes"})
        //if(req.user.role!= role) return res.status(403).send({error: "No permissions"});
        next();
    }
}

const secretKey = process.env.KEY_SECRET;

// Función para generar un token JWT
export const generarToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Puedes personalizar el tiempo de expiración
}

