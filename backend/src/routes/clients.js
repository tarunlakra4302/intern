const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

/**
 * @route GET /api/clients
 * @desc Get clients list
 */
router.get('/', requireAuth, clientsController.list);

/**
 * @route GET /api/clients/:id
 * @desc Get client by ID
 */
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), clientsController.getById);

/**
 * @route POST /api/clients
 * @desc Create client
 */
router.post('/', requireAuth, requireAdmin, clientsController.create);

/**
 * @route PUT /api/clients/:id
 * @desc Update client
 */
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), clientsController.update);

/**
 * @route DELETE /api/clients/:id
 * @desc Delete client
 */
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), clientsController.remove);

module.exports = router;
