import { Router, response } from "express";

const router = Router();

router.get("/", (req, res) => {

    res.clearCookie('coderCookieToken');
    res.redirect('/api')

})

export default router;