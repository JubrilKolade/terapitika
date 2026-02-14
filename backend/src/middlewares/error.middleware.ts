import { Request, Response, NextFunction } from 'express';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { ApiResponse } from '../types';
import logger from '../utils/logger';
import config from '../config/environment';

/**
 * Custom error class
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not Found error handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
}

/**
 * Global error handler
 */
export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any[] | undefined;

  // Handle AppError
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  
  // Handle Sequelize validation errors
  else if (error instanceof SequelizeValidationError) {
    statusCode = 400;
    message = 'Validation error';
    errors = error.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Handle other errors
  else {
    message = error.message || message;
  }

  // Log error
  if (statusCode >= 500) {
    logger.error('Server error:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userId: (req as any).user?.id,
    });
  } else {
    logger.warn('Client error:', {
      message: error.message,
      url: req.originalUrl,
      method: req.method,
      statusCode,
    });
  }

  // Send error response
  const response: ApiResponse = {
    success: false,
    error: message,
    errors,
  };

  // Include stack trace in development
  if (config.env === 'development' && error.stack) {
    (response as any).stack = error.stack;
  }

  return res.status(statusCode).json(response);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Validation error helper
 */
export function createValidationError(message: string): AppError {
  return new AppError(message, 400);
}

/**
 * Unauthorized error helper
 */
export function createUnauthorizedError(message = 'Unauthorized'): AppError {
  return new AppError(message, 401);
}

/**
 * Forbidden error helper
 */
export function createForbiddenError(message = 'Forbidden'): AppError {
  return new AppError(message, 403);
}

/**
 * Not found error helper
 */
export function createNotFoundError(message = 'Not found'): AppError {
  return new AppError(message, 404);
}

/**
 * Conflict error helper
 */
export function createConflictError(message = 'Conflict'): AppError {
  return new AppError(message, 409);
}

export default {
  AppError,
  notFoundHandler,
  errorHandler,
  asyncHandler,
  createValidationError,
  createUnauthorizedError,
  createForbiddenError,
  createNotFoundError,
  createConflictError,
};