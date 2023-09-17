import userModel from "../dao/mongo/models/users.model.js";
import { AuthManager } from "../classes/AuthManager.js";
import { ADM_EMAIL } from "../config/config.js";

async function signup(req, res){
    const { username, email, password, first_name, last_name, age } = req.body;

    const existe = await userModel.findOne({email})

    if (email === ADM_EMAIL || existe !== null ){
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
}

export {signup}