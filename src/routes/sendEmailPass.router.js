import { Router } from "express";
import { getSendEmailPass } from "../controller/sendEmailPass.controller.js";
//import { authorizationUser, passportCall } from "../utils/utils.js";

const router = Router();

router.get("/", getSendEmailPass);

export default router;