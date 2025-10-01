const dotenv = require('dotenv');
const path = require('path');

/**
 * Load environment variables from .env file
 */
function loadEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  dotenv.config({ path: envPath });

  // Log environment info (without sensitive data)
  console.log('Environment loaded:', process.env.NODE_ENV || 'development');
}

module.exports = { loadEnv };