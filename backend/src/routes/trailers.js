const express = require('express');
const router = express.Router();
const trailersController = require('../controllers/trailersController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/trailers
 * @desc Get trailers list
 */
router.get('/', requireAuth, trailersController.list);

/**
 * @route GET /api/trailers/:id
 * @desc Get trailer by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), trailersController.getById);

/**
 * @route POST /api/trailers
 * @desc Create trailer
 */
router.post('/', requireAuth, requireAdmin, trailersController.create);

/**
 * @route PUT /api/trailers/:id
 * @desc Update trailer
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), trailersController.update);

/**
 * @route DELETE /api/trailers/:id
 * @desc Delete trailer
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), trailersController.remove);

module.exports = router;
