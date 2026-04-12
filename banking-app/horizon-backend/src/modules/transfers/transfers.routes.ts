import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { createTransfer } from "./transfers.controller";

const router = Router();

router.use(protect);
router.post("/", createTransfer);

export default router;