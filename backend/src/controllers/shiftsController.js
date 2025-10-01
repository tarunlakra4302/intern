const shiftsService = require('../services/shiftService');

async function list(req, res, next) {
  try {
    const result = await shiftsService.getShifts(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await shiftsService.getShiftById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const item = await shiftsService.createShift(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await shiftsService.updateShift(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await shiftsService.deleteShift(req.params.id);
    res.json({ success: true, message: 'Shift deleted successfully' });
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