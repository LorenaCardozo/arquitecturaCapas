import userModel from "../dao/mongo/models/users.model.js";
import { AuthManager } from "../classes/AuthManager.js";
import { generarToken } from "../utils/utils.js";
import cookie from 'cookie';
import { ADM_EMAIL, ADM_PASS } from "../config/config.js";

async function login(req, res) {

    const { email, password } = req.body;
    let result;

    if (email === ADM_EMAIL && password === ADM_PASS) {
        result = { username: "Admin", email: email, admin: true, role: "admin" }
    } else {
        result = await userModel.findOne({ email });
    }

    if (result === null) {
        return res.status(401).json({
            respuesta: "error de autenticación",
        });
    } else {
        if (AuthManager.isInvalidPassword(result, password)) return res.status(401).send({ status: "error", error: "Error. Revise los datos." });

        const token = generarToken({ email: result.email, username: result.username, admin: result.admin, role: result.role });

        req.session.username = result.username;
        req.session.email = result.email;

        console.log(token);

        // Configura las cookies individualmente
        const cookieOptions = {
            httpOnly: true,
            maxAge: 3600 * 1000,
        };

        const tokenCookie = cookie.serialize('coderCookieToken', token, cookieOptions);

        res.setHeader('Set-Cookie', tokenCookie);

        res.redirect('/api/products');
    }
}


export { login }