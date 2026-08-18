import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/async.handler";
import { User } from "@/models";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const protect = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Not authorized. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new ApiError(401, "Not authorized. Invalid or expired token.");
    }

    const userExists = await User.findById(decoded.userId);
    if (!userExists) {
      throw new ApiError(401, "Not authorized. User no longer exists.");
    }

    req.userId = decoded.userId;
    next();
  }
);




