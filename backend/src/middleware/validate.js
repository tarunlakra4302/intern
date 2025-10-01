const { validationResult, body, param, query } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Middleware to handle validation errors
 * Returns 400 with validation error details if validation fails
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    logger.warn('Validation errors:', formattedErrors);

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: formattedErrors
      }
    });
  }

  next();
}

/**
 * Express middleware factory for validation
 * Wraps express-validator chains and adds error handling
 *
 * @param {Array} validations - Array of express-validator validation chains
 * @returns {Array} Array of middleware functions
 */
function validateRequest(validations) {
  return [...validations, handleValidationErrors];
}

// Common validation chains
const validateEmail = body('email')
  .isEmail()
  .withMessage('Must be a valid email address')
  .normalizeEmail();

const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number');

const validateUUID = (field, location = 'param') => {
  const validator = location === 'param' ? param(field) : location === 'query' ? query(field) : body(field);
  return validator
    .isUUID(4)
    .withMessage(`${field} must be a valid UUID`);
};

const validateDate = (field, location = 'body') => {
  const validator = location === 'param' ? param(field) : location === 'query' ? query(field) : body(field);
  return validator
    .isISO8601()
    .withMessage(`${field} must be a valid ISO 8601 date`);
};

const validateStatus = (field, validStatuses, location = 'body') => {
  const validator = location === 'param' ? param(field) : location === 'query' ? query(field) : body(field);
  return validator
    .isIn(validStatuses)
    .withMessage(`${field} must be one of: ${validStatuses.join(', ')}`);
};

const validatePhone = body('phone')
  .optional()
  .matches(/^\+?[1-9]\d{1,14}$/)
  .withMessage('Must be a valid phone number');

const validateRequired = (field, message, location = 'body') => {
  const validator = location === 'param' ? param(field) : location === 'query' ? query(field) : body(field);
  return validator
    .notEmpty()
    .withMessage(message || `${field} is required`);
};

const validateOptional = (field, type = 'string', location = 'body') => {
  const validator = location === 'param' ? param(field) : location === 'query' ? query(field) : body(field);
  let chain = validator.optional();

  if (type === 'string') {
    chain = chain.isString().withMessage(`${field} must be a string`);
  } else if (type === 'number') {
    chain = chain.isNumeric().withMessage(`${field} must be a number`);
  } else if (type === 'boolean') {
    chain = chain.isBoolean().withMessage(`${field} must be a boolean`);
  } else if (type === 'array') {
    chain = chain.isArray().withMessage(`${field} must be an array`);
  }

  return chain;
};

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100')
    .toInt()
];

const validateSorting = (validFields) => [
  query('sort_by')
    .optional()
    .isIn(validFields)
    .withMessage(`sort_by must be one of: ${validFields.join(', ')}`),
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sort_order must be either asc or desc')
];

module.exports = {
  validateRequest,
  handleValidationErrors,
  validateEmail,
  validatePassword,
  validateUUID,
  validateDate,
  validateStatus,
  validatePhone,
  validateRequired,
  validateOptional,
  validatePagination,
  validateSorting
};