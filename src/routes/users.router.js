import { Router } from "express";
import { authorization, passportCall, authorizationAdmin, authorizationPremium } from "../utils/utils.js";
import { deleteInactivos, getAll, update, deleteUser } from "../controller/users.controller.js";

const router = Router();

router.get("/", passportCall('jwt'), authorizationAdmin(),   getAll);

router.delete("/", passportCall('jwt'), authorizationAdmin(), deleteInactivos);

router.put("/:uid", passportCall('jwt'), authorizationAdmin(), update);

router.delete("/:uid", passportCall('jwt'), authorizationAdmin(), deleteUser);

export default router;