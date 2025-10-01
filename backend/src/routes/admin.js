const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Placeholder routes for admin operations
// TODO: Add authentication middleware when ready: router.use(authMiddleware.requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/drivers', adminController.getDrivers);
router.post('/drivers', adminController.createDriver);
router.get('/vehicles', adminController.getVehicles);
router.post('/vehicles', adminController.createVehicle);
router.get('/jobs', adminController.getJobs);
router.post('/jobs', adminController.createJob);
router.get('/shifts', adminController.getShifts);
router.get('/invoices', adminController.getInvoices);
router.post('/invoices', adminController.createInvoice);

module.exports = router;