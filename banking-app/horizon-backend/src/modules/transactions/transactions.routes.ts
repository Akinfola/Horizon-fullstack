import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getTransactions, getRecentTransactions } from "./transactions.controller";

const router = Router();

router.use(protect);

router.get("/", getTransactions);
router.get("/recent", getRecentTransactions);

export default router;