const fuelService = require('../services/fuelService');

async function list(req, res, next) {
  try {
    const result = await fuelService.getFuel(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await fuelService.getFuelById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const item = await fuelService.createFuel(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await fuelService.updateFuel(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await fuelService.deleteFuel(req.params.id);
    res.json({ success: true, message: 'Fuel entry deleted successfully' });
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