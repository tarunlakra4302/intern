const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get vehicles list with filters
 */
async function getVehicles(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('vehicles');

  if (search) {
    query = query.where(function() {
      this.where('vehicle_code', 'ilike', `%${search}%`);
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
    vehicles: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get vehicle by ID
 */
async function getVehicleById(id) {
  const item = await db('vehicles').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Vehicle not found');
  }

  return item;
}

/**
 * Create vehicle
 */
async function createVehicle(data) {
  const vehicle_code = await idService.getNextCode('VEH');

  const [item] = await db('vehicles')
    .insert({
      vehicle_code,
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update vehicle
 */
async function updateVehicle(id, data) {
  const [item] = await db('vehicles')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Vehicle not found');
  }

  return item;
}

/**
 * Delete vehicle
 */
async function deleteVehicle(id) {
  const deleted = await db('vehicles')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Vehicle not found');
  }

  return { success: true };
}

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
