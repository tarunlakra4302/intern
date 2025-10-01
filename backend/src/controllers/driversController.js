const driversService = require('../services/driversService');

/**
 * List drivers
 */
async function list(req, res, next) {
  try {
    const result = await driversService.getDrivers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get driver by ID
 */
async function getById(req, res, next) {
  try {
    const item = await driversService.getDriverById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create driver
 */
async function create(req, res, next) {
  try {
    const item = await driversService.createDriver(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update driver
 */
async function update(req, res, next) {
  try {
    const item = await driversService.updateDriver(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete driver
 */
async function remove(req, res, next) {
  try {
    await driversService.deleteDriver(req.params.id);
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
