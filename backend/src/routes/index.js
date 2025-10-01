const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const driversRoutes = require('./drivers');
const vehiclesRoutes = require('./vehicles');
const trailersRoutes = require('./trailers');
const clientsRoutes = require('./clients');
const productsRoutes = require('./products');
const suppliersRoutes = require('./suppliers');
const fuelRoutes = require('./fuel');
const expensesRoutes = require('./expenses');
const settingsRoutes = require('./settings');
const shiftsRoutes = require('./shifts');
const jobsRoutes = require('./jobs');
const invoicesRoutes = require('./invoices');
const filesRoutes = require('./files');
const documentsRoutes = require('./documents');
const reportsRoutes = require('./reports');
const driverPortalRoutes = require('./driver');

// Mount routes
router.use('/auth', authRoutes);
router.use('/drivers', driversRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/trailers', trailersRoutes);
router.use('/clients', clientsRoutes);
router.use('/products', productsRoutes);
router.use('/suppliers', suppliersRoutes);
router.use('/fuel', fuelRoutes);
router.use('/expenses', expensesRoutes);
router.use('/settings', settingsRoutes);
router.use('/shifts', shiftsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/invoices', invoicesRoutes);
router.use('/files', filesRoutes);
router.use('/documents', documentsRoutes);
router.use('/reports', reportsRoutes);
router.use('/driver', driverPortalRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root API info
router.get('/', (_req, res) => {
  res.json({
    message: 'Fleet Manager API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      drivers: '/api/drivers',
      vehicles: '/api/vehicles',
      trailers: '/api/trailers',
      clients: '/api/clients',
      products: '/api/products',
      suppliers: '/api/suppliers',
      fuel: '/api/fuel',
      expenses: '/api/expenses',
      settings: '/api/settings',
      shifts: '/api/shifts',
      jobs: '/api/jobs',
      invoices: '/api/invoices',
      files: '/api/files',
      documents: '/api/documents',
      reports: '/api/reports',
      driver: '/api/driver',
      health: '/api/health',
    },
  });
});

module.exports = router;