import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { sendError } from "../utils/response";

export const validateRequest = (schema: {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Detailed validation error for development, generic for production
        const errors = error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }));
        
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors,
        });
      }
      return sendError(res, "Internal validation error", 500);
    }
  };
};
