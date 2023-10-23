import { Router } from "express";
import { authorization, passportCall, loadCart, authorizationAdmin, authorizationPremium } from "../utils/utils.js";
import { deleteId, getAll, save, getId, update } from "../controller/products.controller.js";

const router = Router();

router.get("/",passportCall('jwt'), authorization(), loadCart, getAll);

router.post("/", passportCall('jwt'), authorizationAdmin(),save);

router.delete("/:id", passportCall('jwt'), authorizationPremium(), deleteId);

router.get("/:id", passportCall('jwt'), authorization(), getId);

router.put("/:id", passportCall('jwt'), authorizationPremium(), update);

export default router;