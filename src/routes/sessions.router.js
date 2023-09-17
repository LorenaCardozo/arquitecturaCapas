import { Router } from "express";
import passport from "passport";
import { sessionGithub } from "../controller/sessions.controller.js";

const router = Router();

router.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/api'}), sessionGithub)

export default router;