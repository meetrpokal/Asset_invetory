import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getAnnualBudget, allocateBudget } from "../controllers/budget.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getAnnualBudget);
router.post("/allocate", allocateBudget);

export default router;
