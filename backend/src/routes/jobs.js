const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

router.get('/', requireAuth, jobsController.list);
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), jobsController.getById);
router.post('/', requireAuth, requireAdmin, jobsController.create);
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), jobsController.update);
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), jobsController.remove);

// Job lines
router.post('/:id/lines', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), jobsController.addLine);
router.put('/:id/lines/:lineId', requireAuth, requireAdmin, validateRequest([validateUUID('id'), validateUUID('lineId')]), jobsController.updateLine);
router.delete('/:id/lines/:lineId', requireAuth, requireAdmin, validateRequest([validateUUID('id'), validateUUID('lineId')]), jobsController.removeLine);

module.exports = router;