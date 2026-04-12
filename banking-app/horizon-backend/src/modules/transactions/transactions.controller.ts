import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { getTransactionsService, getRecentTransactionsService,} from "./transactions.service";

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { accountId, page, limit } = req.query;
    const data = await getTransactionsService(
      accountId as string,
      Number(page) || 1,
      Number(limit) || 10
    );
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get transactions";
    return sendError(res, message, 400);
  }
};

export const getRecentTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getRecentTransactionsService(
      req.user!.userId,
      Number(req.query.limit) || 5
    );
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get transactions";
    return sendError(res, message, 400);
  }
};