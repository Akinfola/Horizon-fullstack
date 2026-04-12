import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import {
  getAdminStatsService,
  getAdminUsersService,
  getAdminTransactionsService,
} from "./admin.service";

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminStatsService();
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get stats";
    return sendError(res, message, 400);
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminUsersService(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get users";
    return sendError(res, message, 400);
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAdminTransactionsService(
      Number(req.query.page) || 1,
      Number(req.query.limit) || 10
    );
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get transactions";
    return sendError(res, message, 400);
  }
};