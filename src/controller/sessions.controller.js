import { generarToken } from "../utils.js";

async function sessionGithub(req, res){
    req.session.username = req.user.username;
    const accessToken = generarToken({username: req.user.username, role:"user"});

    res.cookie('coderCookieToken', accessToken, { httpOnly: true, secure: true });

    res.redirect('/api/products');
}

export {sessionGithub}