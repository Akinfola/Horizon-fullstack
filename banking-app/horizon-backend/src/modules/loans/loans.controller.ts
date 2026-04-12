import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { getLoansService, applyLoanService } from "./loans.service";

export const getLoans = async (req: AuthRequest, res: Response) => {
  try {
    const data = await getLoansService(req.user!.userId);
    return sendSuccess(res, data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get loans";
    return sendError(res, message, 400);
  }
};

export const applyLoan = async (req: AuthRequest, res: Response) => {
  try {
    const data = await applyLoanService(req.user!.userId, req.body);
    return sendSuccess(res, data, "Loan application submitted", 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to apply for loan";
    return sendError(res, message, 400);
  }
};