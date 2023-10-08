import { Router } from "express";
import { getResultado } from "../controller/resultado.controller.js";
import { authorizationUser, passportCall } from "../utils/utils.js";

const router = Router();

router.get("/",passportCall('jwt'), authorizationUser(), getResultado);

export default router;