const db = require('../db/knex');

const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get suppliers list with filters
 */
async function getSuppliers(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('suppliers');

  if (search) {
    query = query.where(function() {
      this.where('id', 'ilike', `%${search}%`);
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
    suppliers: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get supplier by ID
 */
async function getSupplierById(id) {
  const item = await db('suppliers').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Supplier not found');
  }

  return item;
}

/**
 * Create supplier
 */
async function createSupplier(data) {
  

  const [item] = await db('suppliers')
    .insert({
      
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update supplier
 */
async function updateSupplier(id, data) {
  const [item] = await db('suppliers')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Supplier not found');
  }

  return item;
}

/**
 * Delete supplier
 */
async function deleteSupplier(id) {
  const deleted = await db('suppliers')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Supplier not found');
  }

  return { success: true };
}

module.exports = {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};
