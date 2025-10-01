const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/products
 * @desc Get products list
 */
router.get('/', requireAuth, productsController.list);

/**
 * @route GET /api/products/:id
 * @desc Get product by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), productsController.getById);

/**
 * @route POST /api/products
 * @desc Create product
 */
router.post('/', requireAuth, requireAdmin, productsController.create);

/**
 * @route PUT /api/products/:id
 * @desc Update product
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), productsController.update);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), productsController.remove);

module.exports = router;
