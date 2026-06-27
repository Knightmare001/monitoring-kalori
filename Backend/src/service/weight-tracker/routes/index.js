import { Router } from "express";
import {
  createWeightRecord,
  getWeightHistory,
  deleteWeightRecord,
} from "../controller/weight-controller.js";
import { validate } from "../../../middleware/validate.js";
import { createWeightValidation } from "../validator/schema.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

// GET  /api/weight-tracker  → Ambil riwayat
router.get("/", getWeightHistory);

// POST /api/weight-tracker  → Tambah catatan baru
router.post("/", validate(createWeightValidation), createWeightRecord);

// DELETE /api/weight-tracker/:id  → Hapus catatan
router.delete("/:id", deleteWeightRecord);

export default router;
