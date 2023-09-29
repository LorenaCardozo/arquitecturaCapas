import { Router } from "express";
import { authorization, passportCall, loadCart } from "../utils.js";
import { getResultado } from "../controller/resultado.controller.js";

const router = Router();

router.get("/",passportCall('jwt'), authorization(), getResultado);

export default router;