import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { ApiError } from "@/utils/ApiError";

export const validate = (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e) => e.message).join(", ");
        return next(new ApiError(400, message));
      }
      next(error);
    }
};

  