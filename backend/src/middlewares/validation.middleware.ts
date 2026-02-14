import { Request, Response, NextFunction } from 'express';
import {
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUUID,
  validatePagination,
} from '../utils/validation';
import { sendError } from '../utils/helpers';
import { ValidationError } from '../types';

/**
 * Validate registration data
 */
export function validateRegistration(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { email, password, firstName, lastName, dateOfBirth, phone } = req.body;
  const errors: ValidationError[] = [];

  // Validate email
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      passwordValidation.errors.forEach((error) => {
        errors.push({ field: 'password', message: error });
      });
    }
  }

  // Validate optional fields
  if (phone && !isValidPhoneNumber(phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  if (firstName && firstName.length < 2) {
    errors.push({ field: 'firstName', message: 'First name must be at least 2 characters' });
  }

  if (lastName && lastName.length < 2) {
    errors.push({ field: 'lastName', message: 'Last name must be at least 2 characters' });
  }

  if (dateOfBirth) {
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'dateOfBirth', message: 'Invalid date format' });
    }
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }

  next();
}

/**
 * Validate login data
 */
export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }

  next();
}

/**
 * Validate password reset request
 */
export function validatePasswordResetRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 'Email is required', 400);
  }

  if (!isValidEmail(email)) {
    return sendError(res, 'Invalid email format', 400);
  }

  next();
}

/**
 * Validate password reset
 */
export function validatePasswordReset(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { token, newPassword } = req.body;
  const errors: ValidationError[] = [];

  if (!token) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  if (!newPassword) {
    errors.push({ field: 'newPassword', message: 'New password is required' });
  } else {
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      passwordValidation.errors.forEach((error) => {
        errors.push({ field: 'newPassword', message: error });
      });
    }
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }

  next();
}

/**
 * Validate change password
 */
export function validateChangePassword(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { currentPassword, newPassword } = req.body;
  const errors: ValidationError[] = [];

  if (!currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }

  if (!newPassword) {
    errors.push({ field: 'newPassword', message: 'New password is required' });
  } else {
    const passwordValidation = isValidPassword(newPassword);
    if (!passwordValidation.valid) {
      passwordValidation.errors.forEach((error) => {
        errors.push({ field: 'newPassword', message: error });
      });
    }
  }

  if (currentPassword === newPassword) {
    errors.push({
      field: 'newPassword',
      message: 'New password must be different from current password'
    });
  }

  if (errors.length > 0) {
    return sendError(res, 'Validation failed', 400, errors);
  }

  next();
}

/**
 * Validate UUID parameter
 */
export function validateUUIDParam(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const uuid = req.params[paramName] as string;

    if (!uuid) {
      return sendError(res, `${paramName} is required`, 400);
    }

    if (!isValidUUID(uuid)) {
      return sendError(res, `Invalid ${paramName} format`, 400);
    }

    next();
  };
}

/**
 * Validate pagination query params
 */
export function validatePaginationParams(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { page, limit } = req.query;
  const validation = validatePagination(
    page as string | undefined,
    limit as string | undefined
  );

  if (validation.errors.length > 0) {
    return sendError(res, 'Invalid pagination parameters', 400, validation.errors);
  }

  // Attach validated values to request
  (req as any).pagination = {
    page: validation.page,
    limit: validation.limit,
  };

  next();
}

/**
 * Validate email verification
 */
export function validateEmailVerification(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { token } = req.body;

  if (!token) {
    return sendError(res, 'Verification token is required', 400);
  }

  next();
}

/**
 * Validate refresh token
 */
export function validateRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendError(res, 'Refresh token is required', 400);
  }

  next();
}

/**
 * Sanitize request body
 */
export function sanitizeBody(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.body) {
    // Remove any undefined or null values
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined || req.body[key] === null) {
        delete req.body[key];
      }

      // Trim string values
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
}

export default {
  validateRegistration,
  validateLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateChangePassword,
  validateUUIDParam,
  validatePaginationParams,
  validateEmailVerification,
  validateRefreshToken,
  sanitizeBody,
};