const express = require('express');
const router = express.Router();
const multer = require('multer');
const filesController = require('../controllers/filesController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateRequest, validateUUID } = require('../middleware/validate');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

router.post('/upload', requireAuth, upload.single('file'), filesController.upload);
router.get('/', requireAuth, filesController.list);
router.get('/:id/download', requireAuth, validateRequest([validateUUID('id')]), filesController.download);
router.delete('/:id', requireAuth, requireAdmin, validateRequest([validateUUID('id')]), filesController.remove);

module.exports = router;