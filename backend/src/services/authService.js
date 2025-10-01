const db = require('../db/knex');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { generateToken } = require('../middleware/authMiddleware');
const { AuthenticationError, NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Login with email and password
 */
async function login(email, password) {
  const user = await db('user_accounts')
    .where({ email })
    .first();

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (user.status !== 'ACTIVE') {
    throw new AuthenticationError('Account is not active');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  // Update last login
  await db('user_accounts')
    .where({ id: user.id })
    .update({ last_login: db.fn.now() });

  const token = generateToken(user);

  // Remove password_hash from response
  delete user.password_hash;

  return { user, token };
}

/**
 * Send password reset email
 */
async function sendResetEmail(email, token) {
  const settings = await db('settings_org').first();

  if (!settings?.smtp_host || !settings?.smtp_user) {
    throw new ValidationError('SMTP settings not configured');
  }

  const transporter = nodemailer.createTransporter({
    host: settings.smtp_host,
    port: settings.smtp_port || 587,
    secure: false,
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: settings.smtp_user,
    to: email,
    subject: 'Password Reset Request - Fleet Manager',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

/**
 * Request password reset
 */
async function requestPasswordReset(email) {
  const user = await db('user_accounts').where({ email }).first();

  if (!user) {
    // Don't reveal if email exists
    return { success: true, message: 'If email exists, reset link has been sent' };
  }

  // Check rate limit (1 request per 5 minutes)
  const recentRequest = await db('password_resets')
    .where('user_id', user.id)
    .where('created_at', '>', db.raw("NOW() - INTERVAL '5 minutes'"))
    .first();

  if (recentRequest) {
    throw new ValidationError('Please wait before requesting another reset');
  }

  // Generate token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Store token
  await db('password_resets').insert({
    user_id: user.id,
    token,
    expires_at: expiresAt,
    created_at: db.fn.now(),
  });

  // Send email
  await sendResetEmail(email, token);

  return { success: true, message: 'Password reset email sent' };
}

/**
 * Confirm password reset with token
 */
async function confirmPasswordReset(token, newPassword) {
  // Find valid token
  const reset = await db('password_resets')
    .where({ token })
    .where('expires_at', '>', db.fn.now())
    .whereNull('used_at')
    .first();

  if (!reset) {
    throw new ValidationError('Invalid or expired reset token');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update password and mark token as used
  await db.transaction(async (trx) => {
    await trx('user_accounts')
      .where({ id: reset.user_id })
      .update({ password_hash: passwordHash });

    await trx('password_resets')
      .where({ id: reset.id })
      .update({ used_at: trx.fn.now() });
  });

  return { success: true, message: 'Password reset successful' };
}

/**
 * Change password (authenticated)
 */
async function changePassword(userId, currentPassword, newPassword) {
  const user = await db('user_accounts').where({ id: userId }).first();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update password
  await db('user_accounts')
    .where({ id: userId })
    .update({ password_hash: passwordHash });

  return { success: true, message: 'Password changed successfully' };
}

/**
 * Hash password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  login,
  requestPasswordReset,
  confirmPasswordReset,
  changePassword,
  hashPassword,
  comparePassword,
};