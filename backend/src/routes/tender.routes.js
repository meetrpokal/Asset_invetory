import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
    createTender,
    getAllTenders,
    submitContractorBid,
    awardTenderToContractor,
} from "../controllers/tender.controllers.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getAllTenders);
router.post("/", createTender);
router.post("/:id/bids", submitContractorBid);
router.post("/:id/award", awardTenderToContractor);

export default router;
