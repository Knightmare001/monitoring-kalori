import { Router } from "express";
import users from "../service/users/routes/index.js";

const router = Router();

router.use("/api/users", users);

export default router;
