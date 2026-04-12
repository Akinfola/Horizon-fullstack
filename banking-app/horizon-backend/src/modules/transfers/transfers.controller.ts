import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { createTransferService } from "./transfers.service";

export const createTransfer = async (req: AuthRequest, res: Response) => {
  try {
    const data = await createTransferService({
      ...req.body,
      userId: req.user!.userId,
    });

    const io = req.app.get("io") as any;
    if (io) {
      io.to(req.user!.userId).emit("realtime:transfer", data);
    }

    return sendSuccess(res, data, "Transfer successful");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Transfer failed";
    return sendError(res, message, 400);
  }
};