import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import {
  getCardsService,
  freezeCardService,
  unfreezeCardService,
} from "./cards.service";

export const getCards = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getCardsService(req.user!.userId);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get cards";
    return sendError(res, message, 400);
  }
};

export const freezeCard = async (req: AuthRequest, res: Response) => {
  try {
    const data = await freezeCardService(req.params.id, req.user!.userId);
    return sendSuccess(res, data, "Card frozen successfully");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to freeze card";
    return sendError(res, message, 400);
  }
};

export const unfreezeCard = async (req: AuthRequest, res: Response) => {
  try {
    const data = await unfreezeCardService(req.params.id, req.user!.userId);
    return sendSuccess(res, data, "Card unfrozen successfully");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to unfreeze card";
    return sendError(res, message, 400);
  }
};