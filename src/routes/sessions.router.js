import { Router, response } from "express";
import passport from "passport";
import { generarToken } from "../utils.js";

const router = Router();

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/api'}), async(req, res)=>{
    req.session.username = req.user.username;
    const accessToken = generarToken({username: req.user.username, role:"user"});

    res.cookie('coderCookieToken', accessToken, { httpOnly: true, secure: true });

    res.redirect('/api/products');
})

export default router;