/**
 * Simple console logger wrapper
 * TODO: Replace with proper logging library (Winston, Pino, etc.)
 */

function info(message, ...args) {
  console.log(`[INFO] ${new Date().toISOString()}:`, message, ...args);
}

function error(message, ...args) {
  console.error(`[ERROR] ${new Date().toISOString()}:`, message, ...args);
}

function warn(message, ...args) {
  console.warn(`[WARN] ${new Date().toISOString()}:`, message, ...args);
}

function debug(message, ...args) {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${new Date().toISOString()}:`, message, ...args);
  }
}

module.exports = {
  info,
  error,
  warn,
  debug,
};