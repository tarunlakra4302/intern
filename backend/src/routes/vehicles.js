const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehiclesController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/vehicles
 * @desc Get vehicles list
 */
router.get('/', requireAuth, vehiclesController.list);

/**
 * @route GET /api/vehicles/:id
 * @desc Get vehicle by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), vehiclesController.getById);

/**
 * @route POST /api/vehicles
 * @desc Create vehicle
 */
router.post('/', requireAuth, requireAdmin, vehiclesController.create);

/**
 * @route PUT /api/vehicles/:id
 * @desc Update vehicle
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), vehiclesController.update);

/**
 * @route DELETE /api/vehicles/:id
 * @desc Delete vehicle
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), vehiclesController.remove);

module.exports = router;
