import { Router } from "express";
import { login } from "../controller/login.controller.js";

const router = Router();

router.get("/", (req, res) => {

    res.render("login")
})

router.post("/", login);


export default router;