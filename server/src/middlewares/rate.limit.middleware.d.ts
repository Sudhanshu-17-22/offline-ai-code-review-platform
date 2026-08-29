import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    userId?: string;
    user?: any;
}
export declare const checkReviewQuota: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const globalRateLimiter: (windowMs?: number, maxRequests?: number) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rate.limit.middleware.d.ts.map