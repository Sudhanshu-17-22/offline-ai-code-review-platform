export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
   details?: Record<string, any> | undefined;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    details?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class RateLimitError extends ApiError {
  retryAfter: number;

  constructor(
    retryAfter: number,
    message = 'Too many requests, please try again later'
  ) {
    super(429, message);
    this.retryAfter = retryAfter;
  }
}
export class ValidationError extends ApiError {
  constructor(
    message: string,
    details?: Record<string, any>
  ) {
    super(400, message, true, details);
  }
}

