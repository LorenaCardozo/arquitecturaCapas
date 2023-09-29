import { Router } from "express";
import { authorization, passportCall } from "../utils.js";
import { getUserDTO } from "../controller/current.controller.js";

const router = Router();

router.get('/', passportCall('jwt'), authorization(), getUserDTO)


export default router;