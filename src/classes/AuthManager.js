export class AuthManager {
    static auth(req, res, next) {
        if (req.session?.username) {
            return next();
        }
        return res.status(401).json("Error de autenticación");
    }
}

export default {
    AuthManager
};