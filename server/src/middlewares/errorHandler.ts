import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ErrorTrackerService } from '../services/error.tracking.service';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      requestId?: string | undefined;
      userId?: string | undefined;
    }
  }
}

export const addRequestId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const context = {
    ...(req.requestId !== undefined && {
      requestId: req.requestId,
    }),
    ...(req.userId !== undefined && {
      userId: req.userId,
    }),
    endpoint: req.path,
    method: req.method,
  };

  ErrorTrackerService.trackError(error, context);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        details: error.details,
      }),
      requestId: req.requestId,
    });
    return;
  }

  logger.error('Unhandled error', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
    requestId: req.requestId,
    ...(process.env.NODE_ENV === 'development' && {
      debug: error.message,
    }),
  });
};

export const asyncHandler = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFoundHandler = (
  req: Request,
  res: Response
): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    statusCode: 404,
    requestId: req.requestId,
  });
};