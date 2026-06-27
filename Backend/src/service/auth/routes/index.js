import { Router } from "express";
import { register, login } from "../controller/auth-controller.js";
import { validate } from "../../../middleware/validate.js";
import { registerValidation, loginValidation } from "../validator/schema.js";

const router = Router();

// POST /api/auth/register
router.post("/register", validate(registerValidation), register);

// POST /api/auth/login
router.post("/login", validate(loginValidation), login);

export default router;
