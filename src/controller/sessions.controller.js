import { generarToken } from "../utils/utils.js";

async function sessionGithub(req, res){
    req.session.username = req.user.username;
    req.session.email = req.user.email;

    const accessToken = generarToken({username: req.user.username, role:"user"});

    res.cookie('coderCookieToken', accessToken, { httpOnly: true, secure: true });

    res.redirect('/api/products');
}

export {sessionGithub}