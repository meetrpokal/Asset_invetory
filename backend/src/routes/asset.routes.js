import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createAsset,
    getAllAssets,
    getNearbyAssets,
    getAssetById,
    updateAsset,
    updateAssetLifecycle,
    deleteAsset,
    getAssetTypes,
    createAssetType,
} from "../controllers/asset.controllers.js";

const router = Router();

router.get("/types", getAssetTypes);
router.post("/types", verifyJWT, createAssetType);

router.get("/nearby", getNearbyAssets);
router.get("/", verifyJWT, getAllAssets);
router.post("/", verifyJWT, createAsset);

router.get("/:id", verifyJWT, getAssetById);
router.put("/:id", verifyJWT, updateAsset);
router.put("/:id/lifecycle", verifyJWT, updateAssetLifecycle);
router.delete("/:id", verifyJWT, deleteAsset);

export default router;
