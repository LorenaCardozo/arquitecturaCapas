async function getSendEmailPass(req, res) {
    try {

    res.render("sendEmailPass", { leyenda: `Si encontramos una cuenta asociado al mail ingresado, le enviaremos un correo electrónico con un enlance, con cual usted puede reiniciar Su contraseña.` });

    } catch (error) {
        res.json({
            message: "Error",
            error: error,
        });

    }
}

export { getSendEmailPass };

