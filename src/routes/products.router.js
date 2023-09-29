import { Router } from "express";
import { authorization, passportCall, loadCart } from "../utils.js";
import { deleteId, getAll, save, getId, update } from "../controller/products.controller.js";

const router = Router();

router.get("/",passportCall('jwt'), authorization(), loadCart, getAll);

router.post("/", passportCall('jwt'), authorization(), save);

router.delete("/:id", passportCall('jwt'), authorization(), deleteId);

router.get("/:id", passportCall('jwt'), authorization(), getId);

router.put("/:id", passportCall('jwt'), authorization(), update);

export default router;