import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createRoad,
    getAllRoads,
    getNearbyRoads,
    getPublicRoadById,
    getRoadById,
    updateRoad,
    updateRoadLifecycle,
    deleteRoad,
    seedDemoData,
} from "../controllers/road.controllers.js";

const router = Router();

router.post("/seed-demo", seedDemoData);
router.get("/public/:id", getPublicRoadById);
router.get("/nearby", getNearbyRoads);
router.get("/", getAllRoads);

router.post("/", verifyJWT, createRoad);
router.get("/:id", verifyJWT, getRoadById);
router.put("/:id", verifyJWT, updateRoad);
router.put("/:id/lifecycle", verifyJWT, updateRoadLifecycle);
router.delete("/:id", verifyJWT, deleteRoad);

export default router;
