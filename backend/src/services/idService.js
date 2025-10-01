const db = require('../db/knex');

/**
 * ID Service
 * Generates human-readable IDs with gap-tolerant counters
 *
 * Supported types:
 * - JOB: Job orders (with year)
 * - SHF: Shifts (with year)
 * - INV: Invoices (with year)
 * - VEH: Vehicles (no year)
 * - DRV: Drivers (no year)
 * - CLI: Clients (no year)
 * - PRD: Products (no year)
 * - TRL: Trailers (no year)
 */

const VALID_TYPES = ['JOB', 'SHF', 'INV', 'VEH', 'DRV', 'CLI', 'PRD', 'TRL'];
const TYPES_WITH_YEAR = ['JOB', 'SHF', 'INV'];

/**
 * Generate the next sequential code for a given type
 * Uses transactions and row locking to prevent race conditions
 *
 * @param {string} type - The entity type (JOB, SHF, INV, VEH, DRV, CLI, PRD, TRL)
 * @returns {Promise<string>} The formatted code (e.g., "JOB-2025-0001" or "VEH-0001")
 * @throws {Error} If type is invalid
 */
async function getNextCode(type) {
  // Validate type
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type: ${type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  return await db.transaction(async (trx) => {
    const year = new Date().getFullYear();
    const hasYear = TYPES_WITH_YEAR.includes(type);

    // Get or create counter with row-level lock to prevent race conditions
    let counter = await trx('counters')
      .where({ year, type })
      .forUpdate()
      .first();

    if (!counter) {
      // Counter doesn't exist, create it
      const [newCounter] = await trx('counters')
        .insert({ year, type, current: 1 })
        .returning('*');
      counter = newCounter;
    } else {
      // Counter exists, increment it
      counter.current += 1;
      await trx('counters')
        .where({ year, type })
        .update({ current: counter.current });
    }

    // Format code based on type
    const padded = String(counter.current).padStart(4, '0');
    return hasYear ? `${type}-${year}-${padded}` : `${type}-${padded}`;
  });
}

/**
 * Get the current counter value without incrementing
 * Useful for previewing the next code that will be generated
 *
 * @param {string} type - The entity type
 * @returns {Promise<number>} The current counter value (0 if not exists)
 */
async function getCurrentCounter(type) {
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type: ${type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  const year = new Date().getFullYear();
  const counter = await db('counters')
    .where({ year, type })
    .first();

  return counter ? counter.current : 0;
}

/**
 * Reset a counter (use with caution!)
 *
 * @param {string} type - The entity type
 * @param {number} value - The value to reset to (default: 0)
 * @returns {Promise<void>}
 */
async function resetCounter(type, value = 0) {
  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type: ${type}. Must be one of: ${VALID_TYPES.join(', ')}`);
  }

  const year = new Date().getFullYear();

  await db('counters')
    .where({ year, type })
    .update({ current: value });
}

module.exports = {
  getNextCode,
  getCurrentCounter,
  resetCounter,
  VALID_TYPES,
  TYPES_WITH_YEAR
};