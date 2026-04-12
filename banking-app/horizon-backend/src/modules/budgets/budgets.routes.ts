import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getBudgets, createBudget, deleteBudget } from "./budgets.controller";

const router = Router();

router.use(protect);

router.get("/", getBudgets);
router.post("/", createBudget);
router.delete("/:id", deleteBudget);

export default router;