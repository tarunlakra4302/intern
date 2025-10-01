const { Pool } = require('pg');

/**
 * PostgreSQL connection pool
 * Placeholder for database connection - will be configured with real credentials
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/fleet_manager',
  // Uncomment when ready to connect:
  // max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

// Placeholder query method
async function query(text, params) {
  // TODO: Implement actual DB queries
  console.log('DB Query (placeholder):', text, params);
  return { rows: [], rowCount: 0 };
}

// Test connection (placeholder)
async function testConnection() {
  try {
    // await pool.query('SELECT NOW()');
    console.log('Database connection ready (placeholder)');
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};