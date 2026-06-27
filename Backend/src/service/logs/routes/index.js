import { Router } from "express";
import { createLog, deleteLog, getTodayLog } from "../controller/log-controller.js";
import { validate } from "../../../middleware/validate.js";
import { createLogValidation } from "../validator/schema.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

// GET  /api/logs/today  → Total konsumsi hari ini (harus didefinisikan sebelum /:id)
router.get("/today", getTodayLog);

// POST /api/logs  → Catat makanan
router.post("/", validate(createLogValidation), createLog);

// DELETE /api/logs/:id  → Hapus entri log
router.delete("/:id", deleteLog);

export default router;
