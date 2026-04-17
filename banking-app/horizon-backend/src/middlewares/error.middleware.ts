import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === "production";

  // Never expose internal stack traces or raw error messages in production
  if (!isProduction) {
    console.error("🔴 Unhandled Error:", err.stack);
  }

  res.status(500).json({
    success: false,
    message: isProduction ? "Internal Server Error" : err.message,
    data: null,
  });
};
