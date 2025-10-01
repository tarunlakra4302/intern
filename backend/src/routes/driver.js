const express = require('express');
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Placeholder routes for driver operations
// TODO: Add authentication middleware when ready: router.use(authMiddleware.requireDriver);

router.get('/profile', driverController.getProfile);
router.put('/profile', driverController.updateProfile);
router.get('/shifts', driverController.getShifts);
router.post('/shifts/clock-in', driverController.clockIn);
router.post('/shifts/clock-out', driverController.clockOut);
router.get('/jobs', driverController.getAssignedJobs);
router.put('/jobs/:id/status', driverController.updateJobStatus);
router.get('/documents', driverController.getDocuments);
router.post('/documents', driverController.uploadDocument);

module.exports = router;