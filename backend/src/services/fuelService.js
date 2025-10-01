const db = require('../db/knex');
const { NotFoundError } = require('../middleware/errorHandler');

async function getFuel(filters = {}) {
  const { page = 1, limit = 50, driver_id, vehicle_id, date_from, date_to, sort_by = 'filled_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('fuel_entries')
    .select(
      'fuel_entries.*',
      'drivers.full_name as driver_name',
      'vehicles.rego_number as vehicle_rego'
    )
    .leftJoin('drivers', 'fuel_entries.driver_id', 'drivers.id')
    .leftJoin('vehicles', 'fuel_entries.vehicle_id', 'vehicles.id');

  if (driver_id) {
    query = query.where('fuel_entries.driver_id', driver_id);
  }

  if (vehicle_id) {
    query = query.where('fuel_entries.vehicle_id', vehicle_id);
  }

  if (date_from) {
    query = query.where('fuel_entries.filled_at', '>=', date_from);
  }

  if (date_to) {
    query = query.where('fuel_entries.filled_at', '<=', date_to);
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset(offset);

  return {
    fuel: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

async function getFuelById(id) {
  const item = await db('fuel_entries')
    .select(
      'fuel_entries.*',
      'drivers.full_name as driver_name',
      'vehicles.rego_number as vehicle_rego'
    )
    .leftJoin('drivers', 'fuel_entries.driver_id', 'drivers.id')
    .leftJoin('vehicles', 'fuel_entries.vehicle_id', 'vehicles.id')
    .where('fuel_entries.id', id)
    .first();

  if (!item) {
    throw new NotFoundError('Fuel entry not found');
  }

  return item;
}

async function createFuel(data) {
  const [item] = await db('fuel_entries')
    .insert({
      ...data,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return item;
}

async function updateFuel(id, data) {
  const [item] = await db('fuel_entries')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Fuel entry not found');
  }

  return item;
}

async function deleteFuel(id) {
  const deleted = await db('fuel_entries').where({ id }).delete();

  if (!deleted) {
    throw new NotFoundError('Fuel entry not found');
  }

  return { success: true };
}

module.exports = {
  getFuel,
  getFuelById,
  createFuel,
  updateFuel,
  deleteFuel,
};