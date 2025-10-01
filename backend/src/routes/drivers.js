const express = require('express');
const router = express.Router();
const driversController = require('../controllers/driversController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/drivers
 * @desc Get drivers list
 */
router.get('/', requireAuth, driversController.list);

/**
 * @route GET /api/drivers/:id
 * @desc Get driver by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), driversController.getById);

/**
 * @route POST /api/drivers
 * @desc Create driver
 */
router.post('/', requireAuth, requireAdmin, driversController.create);

/**
 * @route PUT /api/drivers/:id
 * @desc Update driver
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), driversController.update);

/**
 * @route DELETE /api/drivers/:id
 * @desc Delete driver
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), driversController.remove);

module.exports = router;
