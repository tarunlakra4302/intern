const db = require('../db/knex');

const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get settings list with filters
 */
async function getSettings(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('settings');

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
    settings: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get setting by ID
 */
async function getSettingById(id) {
  const item = await db('settings').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Setting not found');
  }

  return item;
}

/**
 * Create setting
 */
async function createSetting(data) {
  

  const [item] = await db('settings')
    .insert({
      
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update setting
 */
async function updateSetting(id, data) {
  const [item] = await db('settings')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Setting not found');
  }

  return item;
}

/**
 * Delete setting
 */
async function deleteSetting(id) {
  const deleted = await db('settings')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Setting not found');
  }

  return { success: true };
}

module.exports = {
  getSettings,
  getSettingById,
  createSetting,
  updateSetting,
  deleteSetting,
};
