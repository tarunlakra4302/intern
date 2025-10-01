const express = require('express');
const router = express.Router();
const expensesController = require('../controllers/expensesController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/expenses
 * @desc Get expenses list
 */
router.get('/', requireAuth, expensesController.list);

/**
 * @route GET /api/expenses/:id
 * @desc Get expense by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), expensesController.getById);

/**
 * @route POST /api/expenses
 * @desc Create expense
 */
router.post('/', requireAuth, requireAdmin, expensesController.create);

/**
 * @route PUT /api/expenses/:id
 * @desc Update expense
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), expensesController.update);

/**
 * @route DELETE /api/expenses/:id
 * @desc Delete expense
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), expensesController.remove);

module.exports = router;
