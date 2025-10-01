const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/fuel
 * @desc Get fuel list
 */
router.get('/', requireAuth, fuelController.list);

/**
 * @route GET /api/fuel/:id
 * @desc Get fue by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), fuelController.getById);

/**
 * @route POST /api/fuel
 * @desc Create fue
 */
router.post('/', requireAuth, requireAdmin, fuelController.create);

/**
 * @route PUT /api/fuel/:id
 * @desc Update fue
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), fuelController.update);

/**
 * @route DELETE /api/fuel/:id
 * @desc Delete fue
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), fuelController.remove);

module.exports = router;
