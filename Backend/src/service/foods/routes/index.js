import { Router } from "express";
import { getAllFoods, getFoodById } from "../controller/food-controller.js";
import { validateQuery } from "../../../middleware/validate.js";
import { searchQueryValidation } from "../validator/schema.js";
import authenticate from "../../../middleware/authenticate.js";

const router = Router();

router.use(authenticate);

// GET /api/foods?search=ayam
router.get("/", validateQuery(searchQueryValidation), getAllFoods);

// GET /api/foods/:id
router.get("/:id", getFoodById);

export default router;
