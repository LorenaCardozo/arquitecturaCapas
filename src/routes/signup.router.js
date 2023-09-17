import { Router, response } from "express";
import { signup } from "../controller/signup.controller.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("signup")
})

router.post("/", signup);



export default router;