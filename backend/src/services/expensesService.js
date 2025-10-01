const db = require('../db/knex');

const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Get expenses list with filters
 */
async function getExpenses(filters = {}) {
  const { page = 1, limit = 50, search, status, sort_by = 'created_at', sort_order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = db('staff_expenses');

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
    expenses: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get expense by ID
 */
async function getExpenseById(id) {
  const item = await db('staff_expenses').where({ id }).first();

  if (!item) {
    throw new NotFoundError('Expense not found');
  }

  return item;
}

/**
 * Create expense
 */
async function createExpense(data) {
  

  const [item] = await db('staff_expenses')
    .insert({
      
      ...data,
    })
    .returning('*');

  return item;
}

/**
 * Update expense
 */
async function updateExpense(id, data) {
  const [item] = await db('staff_expenses')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Expense not found');
  }

  return item;
}

/**
 * Delete expense
 */
async function deleteExpense(id) {
  const deleted = await db('staff_expenses')
    .where({ id })
    .delete();

  if (!deleted) {
    throw new NotFoundError('Expense not found');
  }

  return { success: true };
}

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
