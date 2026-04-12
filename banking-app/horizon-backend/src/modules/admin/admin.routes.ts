import { Router } from "express";
import { protect, adminOnly } from "../../middlewares/auth.middleware";
import { getStats, getUsers, getTransactions } from "./admin.controller";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/transactions", getTransactions);

export default router;