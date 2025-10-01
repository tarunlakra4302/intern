const express = require('express');
const router = express.Router();
const suppliersController = require('../controllers/suppliersController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/suppliers
 * @desc Get suppliers list
 */
router.get('/', requireAuth, suppliersController.list);

/**
 * @route GET /api/suppliers/:id
 * @desc Get supplier by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), suppliersController.getById);

/**
 * @route POST /api/suppliers
 * @desc Create supplier
 */
router.post('/', requireAuth, requireAdmin, suppliersController.create);

/**
 * @route PUT /api/suppliers/:id
 * @desc Update supplier
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), suppliersController.update);

/**
 * @route DELETE /api/suppliers/:id
 * @desc Delete supplier
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), suppliersController.remove);

module.exports = router;
