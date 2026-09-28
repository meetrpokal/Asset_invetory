import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createContractor,
    getAllContractors,
    getContractorById,
} from "../controllers/contractor.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllContractors);
router.post("/", createContractor);
router.get("/:id", getContractorById);

export default router;
