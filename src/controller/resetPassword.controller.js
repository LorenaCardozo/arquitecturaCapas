import userModel from "../dao/mongo/models/users.model.js";
import { enviarCorreoHtml, generateResetToken, verifyResetToken } from "../utils/utils.js";
import { SITE_URL } from "../config/config.js";
import Users from "../dao/users.dao.js";
import { AuthManager } from "../classes/AuthManager.js";

const users = new Users();

async function getResetPassword(req, res) {
    const { id, token } = req.query;

    console.log(req.query)

    const existe = await userModel.findOne({ _id: id })

    const verify = verifyResetToken(token);

    if (existe === null) {
        return res.status(400).json({ respuesta: "Usuario inválido." })
    }

    if (verify === null) {
        // return res.status(400).json({ respuesta: "Su vínculo para reinicializar la contraseña ha caducado." })

        //res.render("forgotpass", { observacion: "Su vínculo para reinicializar la contraseña ha caducado." });
        res.redirect("/api/forgotpass");
    } else {

        req.session.email = existe.email;

        res.render("resetPassword", { leyenda: "Restablecer Contraseña", usuario: existe.first_name + ' ' + existe.last_name, email: existe.email });
    }
}

async function postResetPassword(req, res) {
    const { email, password, passwordRepeat } = req.body;

    if (password !== passwordRepeat) {
        return res.status(400).json({ respuesta: "Las contraseñas ingresadas no coinciden." })
    }

    const user = await userModel.findOne({ email })

    if (!AuthManager.isInvalidPassword(user, password)) {
        return res.status(400).json({ respuesta: "Debe cambiar la contraseña por una distinta." })
    }

    user.password = AuthManager.createHash(password)

    const result = await users.updateByEmail(email, user)
    res.json({
        data: result,
        message: "Contraseña modificado exitosamente",
    })


}

export { getResetPassword, postResetPassword }