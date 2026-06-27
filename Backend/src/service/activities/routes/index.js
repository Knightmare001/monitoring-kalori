import { Router } from "express";
import {
  getActivityTypes,
  createActivityLog,
  getTodayActivityLogs,
  deleteActivityLog,
} from "../controller/activity-controller.js";
import { validate } from "../../../middleware/validate.js";
import { createActivityLogValidation } from "../validator/schema.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

// GET  /api/activities/types       → Daftar jenis olahraga
router.get("/types", getActivityTypes);

// GET  /api/activities/logs/today  → Log olahraga hari ini
router.get("/logs/today", getTodayActivityLogs);

// POST /api/activities/logs        → Catat olahraga
router.post("/logs", validate(createActivityLogValidation), createActivityLog);

// DELETE /api/activities/logs/:id  → Hapus log
router.delete("/logs/:id", deleteActivityLog);

export default router;
