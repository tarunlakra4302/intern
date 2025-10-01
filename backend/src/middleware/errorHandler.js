const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

/**
 * Global error handler middleware
 * Catches all errors and returns consistent error responses
 */
function errorHandler(err, req, res, _next) {
  // Log error details
  logger.error('Error occurred:', {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details || null;

  // Handle specific error types
  if (err.name === 'ValidationError' || err.code === 'VALIDATION_ERROR') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.code === 'AUTHENTICATION_ERROR') {
    statusCode = 401;
    code = 'AUTHENTICATION_ERROR';
    message = message || 'Authentication failed';
  } else if (err.name === 'ForbiddenError' || err.code === 'AUTHORIZATION_ERROR') {
    statusCode = 403;
    code = 'AUTHORIZATION_ERROR';
    message = message || 'Access denied';
  } else if (err.name === 'NotFoundError' || err.code === 'NOT_FOUND') {
    statusCode = 404;
    code = 'NOT_FOUND';
  } else if (err.code === 'CONFLICT_ERROR') {
    statusCode = 409;
    code = 'CONFLICT_ERROR';
  } else if (err.code === 'DATABASE_ERROR' || err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'A record with this information already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    code = 'FOREIGN_KEY_VIOLATION';
    message = 'Referenced record does not exist';
  } else if (err.code === '22P02') {
    // PostgreSQL invalid text representation
    statusCode = 400;
    code = 'INVALID_DATA_FORMAT';
    message = 'Invalid data format provided';
  }

  // Only send stack trace in development
  const errorResponse = {
    success: false,
    error: {
      message,
      code,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
module.exports.AppError = AppError;
module.exports.ValidationError = ValidationError;
module.exports.NotFoundError = NotFoundError;
module.exports.AuthenticationError = AuthenticationError;
module.exports.AuthorizationError = AuthorizationError;
module.exports.DatabaseError = DatabaseError;
module.exports.ConflictError = ConflictError;
