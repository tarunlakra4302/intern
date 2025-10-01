const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { validateRequest, validateEmail, validatePassword } = require('../middleware/validate');
const { requireAuth } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

/**
 * @route POST /api/auth/login
 * @desc Login with email and password
 */
router.post('/login',
  validateRequest([validateEmail, validatePassword]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/auth/password-reset/request
 * @desc Request password reset
 */
router.post('/password-reset/request',
  validateRequest([validateEmail]),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordReset(email);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/auth/change-password
 * @desc Change password (authenticated)
 */
router.post('/change-password',
  requireAuth,
  validateRequest([
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  ]),
  async (req, res, next) => {
    try {
      const { current_password, new_password } = req.body;
      await authService.changePassword(req.user.id, current_password, new_password);
      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route POST /api/auth/password-reset/confirm
 * @desc Confirm password reset
 */
router.post('/password-reset/confirm',
  validateRequest([
    body('token').notEmpty().withMessage('Token is required'),
    body('new_password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ]),
  async (req, res, next) => {
    try {
      const { token, new_password } = req.body;
      await authService.confirmPasswordReset(token, new_password);
      res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
