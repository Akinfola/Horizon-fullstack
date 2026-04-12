import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  getAccounts,
  getAccountById,
  getTotalBalance,
  createAccount,
} from "./accounts.controller";

const router = Router();

router.use(protect);

router.get("/", getAccounts);
router.get("/total-balance", getTotalBalance);
router.get("/:id", getAccountById);
router.post("/", createAccount);

export default router;