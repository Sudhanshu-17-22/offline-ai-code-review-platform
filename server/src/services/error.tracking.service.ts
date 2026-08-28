import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';

interface ErrorContext {
  userId?: string;
  requestId?: string;
  codeLength?: number;
  language?: string;
  stage?: 'submission' | 'ai_analysis' | 'static_analysis' | 'auth' | 'db';
  endpoint?: string;
  method?: string;
}

export class ErrorTrackerService {
  static trackError(error: unknown, context: ErrorContext): void {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    const statusCode =
      normalizedError instanceof ApiError
        ? normalizedError.statusCode
        : 500;

    const errorData = {
      name: normalizedError.name,
      message: normalizedError.message,
      stack: normalizedError.stack?.split('\n').slice(0, 5),
      statusCode,
      context,
      timestamp: new Date().toISOString(),
    };

    if (statusCode < 500) {
      logger.warn('Client error', errorData);
    } else {
      logger.error('Server error', errorData);
    }
  }

  static generateUserMessage(error: unknown): string {
    const messages: Record<string, string> = {
      ValidationError: 'Invalid input provided. Please check your data.',
      AuthenticationError: 'Please log in to continue.',
      AuthorizationError:
        'You do not have permission to perform this action.',
      NotFoundError: 'The requested resource was not found.',
      ConflictError: 'This resource already exists.',
      RateLimitError:
        'You have made too many requests. Please try again later.',
      ServiceUnavailableError:
        'A service is temporarily unavailable. Please try again in a moment.',
      InternalServerError:
        'An internal server error occurred. Please try again.',
      MongoError: 'Database error occurred. Please try again.',
      OllamaError: 'AI service is temporarily unavailable.',
    };

    const errorName =
      error instanceof Error ? error.name : 'UnknownError';

    return (
      messages[errorName] ||
      'An unexpected error occurred. Please try again.'
    );
  }

  static generateErrorResponse(
    error: unknown,
    context: ErrorContext
  ) {
    this.trackError(error, context);

    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    const statusCode =
      normalizedError instanceof ApiError
        ? normalizedError.statusCode
        : 500;

    return {
      success: false,
      statusCode,
      message: this.generateUserMessage(error),
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          error: normalizedError.message,
          type: normalizedError.name,
          stack: normalizedError.stack,
        },
      }),
    };
  }

  static trackSlowOperation(
    operationName: string,
    durationMs: number,
    threshold: number = 1000
  ): void {
    if (durationMs > threshold) {
      logger.warn('Slow operation detected', {
        operation: operationName,
        durationMs,
        threshold,
        timestamp: new Date().toISOString(),
      });
    }
  }
}


