const expensesService = require('../services/expensesService');

/**
 * List expenses
 */
async function list(req, res, next) {
  try {
    const result = await expensesService.getExpenses(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get expense by ID
 */
async function getById(req, res, next) {
  try {
    const item = await expensesService.getExpenseById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create expense
 */
async function create(req, res, next) {
  try {
    const item = await expensesService.createExpense(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update expense
 */
async function update(req, res, next) {
  try {
    const item = await expensesService.updateExpense(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete expense
 */
async function remove(req, res, next) {
  try {
    await expensesService.deleteExpense(req.params.id);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
