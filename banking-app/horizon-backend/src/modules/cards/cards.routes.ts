import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import { getCards, freezeCard, unfreezeCard } from "./cards.controller";
import { validateRequest } from "../../middlewares/validate.middleware";
import { cardIdParamSchema } from "./cards.types";

const router = Router();

router.use(protect);

router.get("/", getCards);
router.patch("/:id/freeze", validateRequest({ params: cardIdParamSchema }), freezeCard);
router.patch("/:id/unfreeze", validateRequest({ params: cardIdParamSchema }), unfreezeCard);

export default router;