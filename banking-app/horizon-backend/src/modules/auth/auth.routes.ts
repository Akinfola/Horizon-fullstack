import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.types";
import rateLimit from "express-rate-limit";

// Strict rate limiter for login — max 10 attempts per 15 minutes per IP
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
    data: null,
  },
});

// Moderate rate limiter for forgot password — max 5 requests per 60 minutes per IP
export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many password reset requests from this IP. Please try again after 1 hour.",
    data: null,
  },
});

// Rate limiter for resend verification — max 3 requests per 15 minutes per IP
export const resendVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please wait 15 minutes before requesting another verification link.",
    data: null,
  },
});

const router = Router();

// Public routes
router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", loginRateLimiter, validateRequest({ body: loginSchema }), login);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationRateLimiter, resendVerification);
router.post("/forgot-password", forgotPasswordRateLimiter, validateRequest({ body: forgotPasswordSchema }), forgotPassword);
router.post("/reset-password", validateRequest({ body: resetPasswordSchema }), resetPassword);

// Protected routes
router.get("/me", protect, getMe);

export default router;