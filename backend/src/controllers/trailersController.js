const trailersService = require('../services/trailersService');

/**
 * List trailers
 */
async function list(req, res, next) {
  try {
    const result = await trailersService.getTrailers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get trailer by ID
 */
async function getById(req, res, next) {
  try {
    const item = await trailersService.getTrailerById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create trailer
 */
async function create(req, res, next) {
  try {
    const item = await trailersService.createTrailer(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update trailer
 */
async function update(req, res, next) {
  try {
    const item = await trailersService.updateTrailer(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete trailer
 */
async function remove(req, res, next) {
  try {
    await trailersService.deleteTrailer(req.params.id);
    res.json({ success: true, message: 'Trailer deleted successfully' });
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
