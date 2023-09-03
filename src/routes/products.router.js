import { Router } from "express";
import Products from "../dao/dbManager/products.js";
import { AuthManager } from "../classes/AuthManager.js";
import jwt from 'jsonwebtoken';
import { authorization, passportCall } from "../utils.js";
//import {authToken} from "../utils.js"

const router = Router();
const products = new Products();

const camposCompletos = (product) => {
    if (
        product.title === '' || product.title === 'undefined' ||
        product.description === '' || product.description === 'undefined' ||
        product.price === '' || product.price === 'undefined' ||
        product.thumbnail === '' || product.thumbnail === 'undefined' ||
        product.code === '' || product.code === 'undefined' ||
        product.stock === '' || product.stock === 'undefined' ||
        product.category === '' || product.category === 'undefined'
    ) {
        return false;
    }

    return true;
};


router.get("/",passportCall('jwt'), authorization(), async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Obtener el límite de la consulta
        const page = parseInt(req.query.page) || 1; // Obtener la pagina de la consulta
        const sort = req.query.sort;
        const query = req.query.query;

        console.log(req.user);

        /*
        const userName = req.session.username
        const userRole = req.session.admin ? "Administrador" : "Usuario"
*/
        const userName  = req.user.username
        const userRole = req.user.role;



        const result = await products.getAll(limit, page, sort, query);
        const plainProducts = result.docs.map(doc => doc.toObject());

        res.render("products", { Leyenda: "Lista de productos", productos: plainProducts, userName: userName, userRole: userRole });
        /*res.json({
            data: result,
            message: result.length ? "Productos" : "No hay Productos",
        });*/
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error al obtener los productos",
            error: error,
        });
    }
});

router.post("/", passportCall('jwt'), authorization(), async (req, res) => {

    try {
        const { title, description, code, price, status, stock } = req.body;

        if (!camposCompletos(req.body)) {
            return res.status(400).json({
                message: "Faltan datos requeridos"
            })
        } else {
            const p = { title, description, code, price, status, stock }
            const result = await products.save(p)
            res.json({
                data: result,
                message: "Producto creado exitosamente",
            })

        }
    }
    catch (error) {
        res.status(500).json({
            data: [],
            message: "Error al dar de alta el producto",
            error: error,
        });

    }

});

router.delete("/:id", passportCall('jwt'), authorization(), async (req, res) => {
    const { id } = req.params;
    try {

        const result = await products.delete(id);
        res.json({
            data: result,
            message: "Producto eliminado exitosamente"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el producto",
            error: error,
        });
    }
});

router.get("/:id", passportCall('jwt'), authorization(), async (req, res) => {
    const { id } = req.params;

    try {
        const result = await products.getById(id);
        console.log(result.length, id, result)
        res.json({
            data: result,
            message: result.length ? "Producto encontrado" : "Producto no encontrado"
        })

    } catch (error) {
        res.json({
            message: "Error al obtener el producto",
            error: error,
        })

    }

});

router.put("/:id", passportCall('jwt'), authorization(), async (req, res) => {

    const { id } = req.params;

    try {
        const { title, description, code, price, status, stock } = req.body;

        if (!camposCompletos(req.body) || !id) {
            return res.status(400).json({
                message: "Faltan datos requeridos"
            })
        } else {
            const p = { title, description, code, price, status, stock }
            const result = await products.update(id, p);
            res.json({
                data: result,
                message: "Producto modificado exitosamente",
            })

        }
    }
    catch (error) {
        res.status(500).json({
            data: [],
            message: "Error al modificar el producto",
            error: error,
        });

    }

});

export default router;