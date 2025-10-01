const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get drivers list with filters
 */
async function getDrivers(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('drivers');

  if (search) {
    query = query.where(function() {
      this.where('driver_code', 'ilike', `%${search}%`);
    });
  }

  if (status) {
    query = query.where({ status });
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset(offset);

  return {
    drivers: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get driver by ID
 */
async function getDriverById(id) {
  const item = await db('drivers').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Driver not found');
  }

  return item;
}

/**
 * Create driver
 */
async function createDriver(data) {
  const driver_code = await idService.getNextCode('DRV');

  const [item] = await db('drivers')
    .insert({
      driver_code,
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update driver
 */
async function updateDriver(id, data) {
  const [item] = await db('drivers')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Driver not found');
  }

  return item;
}

/**
 * Delete driver
 */
async function deleteDriver(id) {
  const deleted = await db('drivers')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Driver not found');
  }

  return { success: true };
}

module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
