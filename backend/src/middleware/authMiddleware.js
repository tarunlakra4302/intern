const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Generate JWT token for a user
 *
 * @param {Object} user - User object with id, email, role
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify JWT token and return decoded payload
 *
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

/**
 * Express middleware to require authentication
 * Validates JWT from Authorization header and attaches user to req.user
 */
function requireAuth(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'No authorization header provided',
          code: 'NO_AUTH_HEADER'
        }
      });
    }

    // Check Bearer format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid authorization header format. Expected: Bearer <token>',
          code: 'INVALID_AUTH_FORMAT'
        }
      });
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyToken(token);

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    logger.info(`User authenticated: ${decoded.email} (${decoded.role})`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: {
        message: error.message || 'Authentication failed',
        code: 'AUTH_FAILED'
      }
    });
  }
}

/**
 * Express middleware to require specific role
 * Must be used after requireAuth
 *
 * @param {string} role - Required role (ADMIN, DRIVER, etc.)
 * @returns {Function} Express middleware
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      });
    }

    if (req.user.role !== role) {
      logger.warn(`User ${req.user.email} attempted to access ${role}-only resource`);
      return res.status(403).json({
        success: false,
        error: {
          message: `Access denied. ${role} role required.`,
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      });
    }

    next();
  };
}

/**
 * Express middleware to require admin role
 * Shorthand for requireRole('ADMIN')
 */
function requireAdmin(req, res, next) {
  return requireRole('ADMIN')(req, res, next);
}

/**
 * Express middleware to require driver role
 * Shorthand for requireRole('DRIVER')
 */
function requireDriver(req, res, next) {
  return requireRole('DRIVER')(req, res, next);
}

module.exports = {
  generateToken,
  verifyToken,
  requireAuth,
  requireRole,
  requireAdmin,
  requireDriver,
};
