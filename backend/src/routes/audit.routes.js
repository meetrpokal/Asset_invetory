import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getAuditLogs } from "../controllers/audit.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getAuditLogs);

export default router;
