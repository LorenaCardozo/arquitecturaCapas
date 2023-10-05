import { Router} from "express";
import { mockingProducts } from "../controller/mockingproducts.controller.js";
const router = Router();

router.get("/", mockingProducts);


export default router;