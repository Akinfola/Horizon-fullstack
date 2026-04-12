import { Request, Response } from "express";
import { registerService, loginService, getMeService } from "./auth.service";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body);
    return sendSuccess(res, result, "Account created successfully", 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    console.error("🔴 Register Error:", message, "| Body:", req.body);
    return sendError(res, message, 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    return sendSuccess(res, result, "Login successful");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    return sendError(res, message, 400);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getMeService(req.user!.userId);
    return sendSuccess(res, user, "User fetched successfully");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get user";
    return sendError(res, message, 400);
  }
};