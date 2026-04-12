import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getCards, freezeCard, unfreezeCard } from "./cards.controller";

const router = Router();

router.use(protect);

router.get("/", getCards);
router.patch("/:id/freeze", freezeCard);
router.patch("/:id/unfreeze", unfreezeCard);

export default router;