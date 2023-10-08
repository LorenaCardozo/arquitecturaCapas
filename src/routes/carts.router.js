import { Router} from "express";
import { deleteId, deleteProduc, getAll, getId, save, saveProduc, update, updateId, purchase } from "../controller/carts.controller.js";
import { authorization, authorizationUser, passportCall } from "../utils/utils.js";

const router = Router();

router.get("/", getAll);
router.get("/:id",passportCall('jwt'), authorizationUser(), getId);
router.post("/",passportCall('jwt'), authorizationUser(), save);
router.post("/:cid/product/:pid",passportCall('jwt'), authorizationUser(), saveProduc);
router.delete("/:cid/products/:pid",passportCall('jwt'), authorizationUser(), deleteProduc);
router.put("/:cid",passportCall('jwt'), authorizationUser(), update);
router.put("/:cid/products/:pid",passportCall('jwt'), authorizationUser(), updateId);
router.delete("/:cid",passportCall('jwt'), authorizationUser(),deleteId)
router.post("/:cid/purchase",passportCall('jwt'), authorizationUser(), purchase);

export default router;