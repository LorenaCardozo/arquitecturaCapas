import { Router, response } from "express";
import userModel from "../models/users.model.js"

const router = Router();

router.get("/", (req, res) => {
    res.render("signup")
})

router.post("/", async (req, res) => {
    const { username, email, password } = req.body;

    const existe = await userModel.findOne({email})

    if (email === "admincoder@coder.com" || existe !== null ){
        return res.status(400).json({ respuesta:"Ya existe un usuario registrado con ese email." })
    }

    const result = await userModel.create({
        username,
        email,
        password,
    });

    if (result === null) {
        return res.status(401).json({
            respuesta: "error",
        });
    } else {
//        req.session.username = email;
//        req.session.admin = true;
        /*res.status(200).json({
            respuesta: "ok",
        });*/

        res.redirect('/api')
    }
});



export default router;