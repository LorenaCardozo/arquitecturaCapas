import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const secretKey = 'tu_clave_secreta';

export class AuthManager {

    static authT = (req, res, next) => {
        const authHeader = req.headers.authorization;;

        if (!authHeader) {
            return res.status(401).json({ error: 'Error de autenticación' });
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Token no válido." });
            }

            // Si el token es válido, puedes almacenar el usuario en la solicitud
            req.user = user;
            return next();
        });
    };

    static createHash(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    static isInvalidPassword(user, password) {

        if (user.admin === true) return false;

        return !bcrypt.compareSync(password, user.password);
    }
}

export default AuthManager;
