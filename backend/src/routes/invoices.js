const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoicesController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

router.get('/', requireAuth, invoicesController.list);
router.get('/:id', requireAuth, validateRequest([validateUUID('id')]), invoicesController.getById);
router.get('/:id/pdf', requireAuth, validateRequest([validateUUID('id')]), invoicesController.downloadPDF);
router.post('/', requireAuth, requireAdmin, invoicesController.createFromJob);
router.post('/:id/issue', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), invoicesController.issue);
router.put('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), invoicesController.update);
router.post('/:id/cancel', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), invoicesController.cancel);

module.exports = router;