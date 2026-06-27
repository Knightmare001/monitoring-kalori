import { Router } from "express";
import { calculate, calculateFromProfile } from "../controller/calculator-controller.js";
import { validate } from "../../../middleware/validate.js";
import { calculatorValidation } from "../validator/schema.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

// POST /api/calculator  → Input manual (tidak harus login)
router.post("/", validate(calculatorValidation), calculate);

// GET  /api/calculator/my  → Hitung otomatis dari profil user (butuh login)
router.get("/my", authenticate, calculateFromProfile);

export default router;
