import { Response } from "express";

export const sendSuccess = (res: Response, data: unknown, message = "Success", status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

export const sendError = (res: Response, message = "Something went wrong", status = 500) => {
  console.error("❌ ERROR:", message);
  return res.status(status).json({ success: false, message, data: null });
};