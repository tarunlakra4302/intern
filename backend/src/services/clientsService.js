const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get clients list with filters
 */
async function getClients(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('clients');

  if (search) {
    query = query.where(function() {
      this.where('client_code', 'ilike', `%${search}%`).orWhere('name', 'ilike', `%${search}%`);
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
    clients: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get client by ID
 */
async function getClientById(id) {
  const item = await db('clients').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Client not found');
  }

  return item;
}

/**
 * Create client
 */
async function createClient(data) {
  const client_code = await idService.getNextCode('CLI');

  const [item] = await db('clients')
    .insert({
      client_code,
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update client
 */
async function updateClient(id, data) {
  const [item] = await db('clients')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Client not found');
  }

  return item;
}

/**
 * Delete client
 */
async function deleteClient(id) {
  const deleted = await db('clients')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Client not found');
  }

  return { success: true };
}

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
