import { Router} from "express";
import { deleteId, deleteProduc, getAll, getId, save, saveProduc, update, updateId, purchase } from "../controller/carts.controller.js";
import { authorization, passportCall } from "../utils.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getId);
router.post("/", save);
router.post("/:cid/product/:pid", saveProduc);
router.delete("/:cid/products/:pid", deleteProduc);
router.put("/:cid", update);
router.put("/:cid/products/:pid", updateId);
router.delete("/:cid",deleteId)
router.post("/:cid/purchase",passportCall('jwt'), authorization(), purchase);

export default router;