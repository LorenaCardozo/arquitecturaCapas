import { Router, response } from "express";
import userModel from "../models/users.model.js"
import { AuthManager } from "../classes/AuthManager.js";
import * as dotenv from "dotenv";

dotenv.config();
const router = Router();

router.get("/", (req, res) => {
    res.render("signup")
})

router.post("/", async (req, res) => {
    const { username, email, password, first_name, last_name, age } = req.body;

    const existe = await userModel.findOne({email})

    if (email === process.env.ADM_EMAIL || existe !== null ){
        return res.status(400).json({ respuesta:"Ya existe un usuario registrado con ese email." })
    }

    const result = await userModel.create({
        first_name, 
        last_name, 
        age,
        username,
        email,
        password: AuthManager.createHash(password) ,
        role: 'user'
    });

    if (result === null) {
        return res.status(401).json({
            respuesta: "error",
        });
    } else {
        res.redirect('/api')
    }
});



export default router;