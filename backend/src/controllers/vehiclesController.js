const vehiclesService = require('../services/vehiclesService');

/**
 * List vehicles
 */
async function list(req, res, next) {
  try {
    const result = await vehiclesService.getVehicles(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get vehicle by ID
 */
async function getById(req, res, next) {
  try {
    const item = await vehiclesService.getVehicleById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create vehicle
 */
async function create(req, res, next) {
  try {
    const item = await vehiclesService.createVehicle(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update vehicle
 */
async function update(req, res, next) {
  try {
    const item = await vehiclesService.updateVehicle(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete vehicle
 */
async function remove(req, res, next) {
  try {
    await vehiclesService.deleteVehicle(req.params.id);
    res.json({ success: true, message: 'Vehicle deleted successfully' });
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
