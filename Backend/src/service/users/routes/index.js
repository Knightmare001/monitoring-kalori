import { Router } from "express";
import { getProfile, updateProfile, deleteAccount } from "../controller/user-controller.js";
import { validate } from "../../../middleware/validate.js";
import { updateProfileValidation } from "../validator/schema.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

// Semua route di bawah ini memerlukan token JWT
router.use(authenticate);

// GET  /api/users/me  → Ambil profil sendiri
router.get("/me", getProfile);

// PUT  /api/users/me  → Update profil & data fisik
router.put("/me", validate(updateProfileValidation), updateProfile);

// DELETE /api/users/me → Hapus akun
router.delete("/me", deleteAccount);

export default router;
