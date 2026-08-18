import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";

export interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const payload: JwtPayload = { userId };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

