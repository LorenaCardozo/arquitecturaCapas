import userModel from "../dao/mongo/models/users.model.js";
import { enviarCorreoHtml, generateResetToken } from "../utils/utils.js";
import { SITE_URL } from "../config/config.js";

async function getForgotpass (req, res){
    const origin = req.get('Referer');
    let obs = "";
    if (origin === undefined)
    {obs = "Su vínculo para reinicializar la contraseña ha caducado."}

    res.render("forgotpass", {observacion: obs})

}

async function forgotpass(req, res) {

    const { email } = req.body;

    const existe = await userModel.findOne({ email })

    if (existe === null) {
        return res.status(400).json({ respuesta: "Usuario inválido." })
    }

    // Generar un token
    const resetToken = generateResetToken(email);
    //console.log('Token de restablecimiento de contraseña:', resetToken, email);

    const link = `${SITE_URL}/resetpassword?id=${existe._id}&token=${resetToken}`;

    enviarCorreoHtml(email, "Restablecer contraseña", `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${link}">Restablecer contraseña</a>`);

    res.redirect('/api/sendEmailPass');


}

export { forgotpass , getForgotpass}