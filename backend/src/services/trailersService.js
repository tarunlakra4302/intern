const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get trailers list with filters
 */
async function getTrailers(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('trailers');

  if (search) {
    query = query.where(function() {
      this.where('trailer_code', 'ilike', `%${search}%`);
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
    trailers: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get trailer by ID
 */
async function getTrailerById(id) {
  const item = await db('trailers').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Trailer not found');
  }

  return item;
}

/**
 * Create trailer
 */
async function createTrailer(data) {
  const trailer_code = await idService.getNextCode('TRL');

  const [item] = await db('trailers')
    .insert({
      trailer_code,
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update trailer
 */
async function updateTrailer(id, data) {
  const [item] = await db('trailers')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Trailer not found');
  }

  return item;
}

/**
 * Delete trailer
 */
async function deleteTrailer(id) {
  const deleted = await db('trailers')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Trailer not found');
  }

  return { success: true };
}

module.exports = {
  getTrailers,
  getTrailerById,
  createTrailer,
  updateTrailer,
  deleteTrailer,
};
