import bcrypt from "bcrypt"
export class AuthManager {
    static auth(req, res, next) {

        //console.log('ENTRE', req)
        if (req.session?.username || req.session?.user.username) {
            return next();
        }
        return res.status(401).json("Error de autenticación");
    }

    static createHash(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static isInvalidPassword (user, password){
        return bcrypt.compareSync(password, user.password);
    }

}


export default {
    AuthManager
};