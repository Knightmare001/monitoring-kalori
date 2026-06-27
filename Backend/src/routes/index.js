import { Router } from "express";
import auth from "../service/auth/routes/index.js";
import users from "../service/users/routes/index.js";
import foods from "../service/foods/routes/index.js";
import logs from "../service/logs/routes/index.js";
import weightTracker from "../service/weight-tracker/routes/index.js";
import calculator from "../service/calculator/routes/index.js";
import dashboard from "../service/dashboard/routes/index.js";
import activities from "../service/activities/routes/index.js";

const router = Router();

router.use("/api/auth", auth);
router.use("/api/users", users);
router.use("/api/foods", foods);
router.use("/api/logs", logs);
router.use("/api/weight-tracker", weightTracker);
router.use("/api/calculator", calculator);
router.use("/api/dashboard", dashboard);
router.use("/api/activities", activities);

export default router;
