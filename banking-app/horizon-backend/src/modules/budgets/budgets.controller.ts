import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import {
  getBudgetsService,
  createBudgetService,
  deleteBudgetService,
} from "./budgets.service";

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getBudgetsService(req.user!.userId);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get budgets";
    return sendError(res, message, 400);
  }
};

export const createBudget = async (req: AuthRequest, res: Response) => {
  try {
    const data = await createBudgetService(req.user!.userId, req.body);
    return sendSuccess(res, data, "Budget created", 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create budget";
    return sendError(res, message, 400);
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const data = await deleteBudgetService(req.params.id, req.user!.userId);
    return sendSuccess(res, data, "Budget deleted");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete budget";
    return sendError(res, message, 400);
  }
};