import express from "express";
import { ProductManager } from '../ProductManager.js';

const router = express.Router();
const pm = new ProductManager("productos.json");

const productos = await pm.getProducts();

router.get("/", (req, res)=>{
    res.render("Home", {title: "Home", productos: productos});

})

export default router;

