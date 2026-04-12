import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import {
  getAccountsService,
  getAccountByIdService,
  getTotalBalanceService,
  createAccountService,
} from "./accounts.service";

export const getAccounts = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAccountsService(req.user!.userId);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get accounts";
    return sendError(res, message, 400);
  }
};

export const getAccountById = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getAccountByIdService(req.params.id, req.user!.userId);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get account";
    return sendError(res, message, 400);
  }
};

export const getTotalBalance = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getTotalBalanceService(req.user!.userId);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get balance";
    return sendError(res, message, 400);
  }
};

export const createAccount = async (req: AuthRequest, res: Response) => {
  try {
    const data = await createAccountService(req.user!.userId, req.body);
    return sendSuccess(res, data, "Account created", 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create account";
    return sendError(res, message, 400);
  }
};