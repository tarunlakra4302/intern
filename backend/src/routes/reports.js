const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// New aligned endpoints
router.get('/overview', requireAuth, reportsController.overview);
router.get('/financial', requireAuth, requireAdmin, reportsController.financial);
router.get('/fleet', requireAuth, reportsController.fleet);
router.get('/driver', requireAuth, reportsController.driver);
router.get('/fuel', requireAuth, reportsController.fuel);

// Legacy endpoints (keep for backward compatibility)
router.get('/driver-timesheet', requireAuth, reportsController.driverTimesheet);
router.get('/service-list', requireAuth, reportsController.serviceList);
router.get('/job-attachments', requireAuth, requireAdmin, reportsController.jobAttachments);

module.exports = router;