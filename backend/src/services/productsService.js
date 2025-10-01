const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get products list with filters
 */
async function getProducts(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('products');

  if (search) {
    query = query.where(function() {
      this.where('product_code', 'ilike', `%${search}%`);
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
    products: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get product by ID
 */
async function getProductById(id) {
  const item = await db('products').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Product not found');
  }

  return item;
}

/**
 * Create product
 */
async function createProduct(data) {
  const product_code = await idService.getNextCode('PRD');

  const [item] = await db('products')
    .insert({
      product_code,
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update product
 */
async function updateProduct(id, data) {
  const [item] = await db('products')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Product not found');
  }

  return item;
}

/**
 * Delete product
 */
async function deleteProduct(id) {
  const deleted = await db('products')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Product not found');
  }

  return { success: true };
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
