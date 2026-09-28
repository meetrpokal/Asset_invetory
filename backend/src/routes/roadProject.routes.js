import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createRoadProject,
    getAllRoadProjects,
    getRoadProjectById,
    updateMaterialsAndCosts,
    updateConstructionProgress,
    updateProjectStatus,
    convertProjectToRoadAsset,
} from "../controllers/roadProject.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllRoadProjects);
router.post("/", createRoadProject);
router.get("/:id", getRoadProjectById);
router.put("/:id/materials", updateMaterialsAndCosts);
router.put("/:id/progress", updateConstructionProgress);
router.put("/:id/status", updateProjectStatus);
router.post("/:id/convert-to-road", convertProjectToRoadAsset);

export default router;
