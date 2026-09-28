import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createMaintenance,
    getAllMaintenance,
    getPreventiveDashboard,
    updateMaintenance,
} from "../controllers/maintenance.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/preventive", getPreventiveDashboard);
router.get("/", getAllMaintenance);
router.post("/", createMaintenance);
router.put("/:id", updateMaintenance);

export default router;
