const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/settings
 * @desc Get settings list
 */
router.get('/', requireAuth, settingsController.list);

/**
 * @route GET /api/settings/:id
 * @desc Get setting by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), settingsController.getById);

/**
 * @route POST /api/settings
 * @desc Create setting
 */
router.post('/', requireAuth, requireAdmin, settingsController.create);

/**
 * @route PUT /api/settings/:id
 * @desc Update setting
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), settingsController.update);

/**
 * @route DELETE /api/settings/:id
 * @desc Delete setting
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), settingsController.remove);

module.exports = router;
