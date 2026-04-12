import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getLoans, applyLoan } from "./loans.controller";

const router = Router();

router.use(protect);

router.get("/", getLoans);
router.post("/apply", applyLoan);

export default router;