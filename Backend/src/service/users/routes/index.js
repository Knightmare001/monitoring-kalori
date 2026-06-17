import { Router } from "express";
import { createUser } from "../controller/user-contoller.js";
import { validate } from "../../../middleware/validate.js";
import { registerValidation } from "../validator/schema.js";

const router = Router();

router.post("/register", validate(registerValidation), createUser);

export default router;
