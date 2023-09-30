import { Router } from "express";
import { getResultado } from "../controller/resultado.controller.js";
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.get("/",passportCall('jwt'), authorization(), getResultado);

export default router;