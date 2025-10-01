const express = require('express');
const router = express.Router();
const shiftsController = require('../controllers/shiftsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

router.get('/', requireAuth, shiftsController.list);
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), shiftsController.getById);
router.post('/', requireAuth, requireAdmin, shiftsController.create);
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), shiftsController.update);
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), shiftsController.remove);

module.exports = router;