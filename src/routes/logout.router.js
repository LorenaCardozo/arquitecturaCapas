import { Router, response } from "express";

const router = Router();

router.get("/", (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            res.redirect('/api')
        } else {
            res.json({ status: "Error al cerrar sesión", body: err })
        }
    })

})

export default router;