const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentsController = require('../controllers/documentsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get('/categories/counts', requireAuth, documentsController.getCounts);
router.get('/search', requireAuth, documentsController.search);
router.get('/category/:category', requireAuth, documentsController.getByCategory);
router.post('/upload', requireAuth, requireAdmin, upload.single('file'), documentsController.upload);
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), documentsController.remove);

module.exports = router;