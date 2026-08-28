import { Request, Response, NextFunction } from 'express';
import { Sanitizer } from '../utils/sanitizer';
import { ValidationError } from '../utils/ApiError';
import { logger } from '../utils/logger';

export const sanitizeCodeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.body?.code !== undefined) {
      req.body.code = Sanitizer.sanitizeCode(req.body.code);
    }

    if (req.body?.language !== undefined) {
      req.body.language = Sanitizer.sanitizeLanguage(req.body.language);
    }

    if (req.body?.fileName !== undefined) {
      req.body.fileName = Sanitizer.sanitizeFilename(req.body.fileName);
    }

    next();
  } catch (error) {
    logger.warn('Sanitization failed', {
      error: error instanceof Error ? error.message : error,
      path: req.path,
      method: req.method,
    });

    next(
      new ValidationError(
        error instanceof Error ? error.message : 'Invalid input'
      )
    );
  }
};

export const sanitizeBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (
      req.body &&
      typeof req.body === 'object' &&
      !Array.isArray(req.body)
    ) {
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = Sanitizer.sanitizeString(req.body[key]);
        }
      });
    }

    next();
  } catch (error) {
    logger.error('Body sanitization failed', {
      error: error instanceof Error ? error.message : error,
      path: req.path,
      method: req.method,
    });

    next(error);
  }
};

export const sanitizeQueryMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    req.query = Sanitizer.sanitizeQuery(req.query);
    next();
  } catch (error) {
    logger.error('Query sanitization failed', {
      error: error instanceof Error ? error.message : error,
      path: req.path,
      method: req.method,
    });

    next(error);
  }
};





