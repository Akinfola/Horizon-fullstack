import { Request, Response } from "express";
import {
  registerService,
  loginService,
  getMeService,
  verifyEmailService,
  resendVerificationService,
  forgotPasswordService,
  resetPasswordService,
} from "./auth.service";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth.middleware";

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body);
    return sendSuccess(res, result, result.message, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return sendError(res, message, 400);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response) => {
  try {
    const { user, accessToken } = await loginService(req.body);

    // Set HttpOnly cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // MUST be true for cross-domain
      sameSite: "none", // MUST be 'none' for cross-domain (Vercel -> Render)
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    
    return sendSuccess(res, { user }, "Login successful");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    const statusCode = message.includes("locked") ? 423 : 401;
    return sendError(res, message, statusCode);
  }
};

// ─── Logout ────────────────────────────────────────────────────────────────────

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  return sendSuccess(res, null, "Logged out successfully");
};

// ─── Verify Email ──────────────────────────────────────────────────────────────

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };
    const result = await verifyEmailService(token);

    // Issue an auth cookie so the user is auto-logged in after verification
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true, // MUST be true for cross-domain
      sameSite: "none", // MUST be 'none' for cross-domain
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return sendSuccess(res, { user: result.user }, result.message);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Email verification failed";
    return sendError(res, message, 400);
  }
};

// ─── Resend Verification ──────────────────────────────────────────────────────

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, "Email is required", 400);
    const result = await resendVerificationService(email);
    return sendSuccess(res, null, result.message);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resend verification";
    return sendError(res, message, 400);
  }
};

// ─── Forgot Password ───────────────────────────────────────────────────────────

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, "Email is required", 400);
    const result = await forgotPasswordService(email);
    // Always return 200 to prevent user enumeration
    return sendSuccess(res, null, result.message);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process request";
    return sendError(res, message, 500);
  }
};

// ─── Reset Password ────────────────────────────────────────────────────────────

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.query as { token: string };
    const { newPassword } = req.body;
    if (!token) return sendError(res, "Reset token is required", 400);
    if (!newPassword) return sendError(res, "New password is required", 400);
    const result = await resetPasswordService(token, newPassword);
    return sendSuccess(res, null, result.message);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Password reset failed";
    return sendError(res, message, 400);
  }
};

// ─── Get Me ────────────────────────────────────────────────────────────────────

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getMeService(req.user!.userId);
    return sendSuccess(res, user, "User fetched successfully");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to get user";
    return sendError(res, message, 400);
  }
};