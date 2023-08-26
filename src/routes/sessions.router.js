import { Router, response } from "express";
import passport from "passport";

const router = Router();

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/api'}), async(req, res)=>{
    req.session.username = req.user.username;
    res.redirect('/api/products');
})

export default router;