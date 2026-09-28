import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createInspection, getAllInspections } from "../controllers/inspection.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllInspections);
router.post("/", createInspection);

export default router;
