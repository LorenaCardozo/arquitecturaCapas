import { Router } from "express";
import { getResetPassword , postResetPassword} from "../controller/resetPassword.controller.js";
//import { authorizationUser, passportCall } from "../utils/utils.js";

const router = Router();

router.get("/", getResetPassword);
router.post("/", postResetPassword);

export default router;