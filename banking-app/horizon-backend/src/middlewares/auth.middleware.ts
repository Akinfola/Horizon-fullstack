import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Check cookies first
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Fallback to Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendError(res, "Not authorized, no token", 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return sendError(res, "Not authorized, invalid token", 401);
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return sendError(res, "Access denied, admins only", 403);
  }
  next();
};