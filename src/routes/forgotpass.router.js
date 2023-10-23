import { Router } from "express";
import { forgotpass, getForgotpass } from "../controller/forgotpass.controller.js";

const router = Router();

router.get("/", getForgotpass)
router.post("/", forgotpass);

export default router;