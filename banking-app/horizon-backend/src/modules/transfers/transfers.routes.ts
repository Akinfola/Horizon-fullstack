import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import { createTransfer } from "./transfers.controller";
import { createTransferSchema } from "./transfers.types";

const router = Router();

router.use(protect);
router.post("/", validateRequest({ body: createTransferSchema }), createTransfer);

export default router;