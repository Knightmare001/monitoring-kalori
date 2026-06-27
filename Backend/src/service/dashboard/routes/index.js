import { Router } from "express";
import { getDashboardSummary } from "../controller/dashboard-controller.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

// GET /api/dashboard/summary
router.get("/summary", getDashboardSummary);

export default router;
