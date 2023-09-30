import { Router } from "express";
import { getResultado } from "../controller/resultado.controller.js";
import { authorization, authorizationUser, passportCall } from "../utils.js";

const router = Router();

router.get("/",passportCall('jwt'), authorizationUser(), getResultado);

export default router;