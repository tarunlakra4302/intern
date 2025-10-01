const settingsService = require('../services/settingsService');

/**
 * List settings
 */
async function list(req, res, next) {
  try {
    const result = await settingsService.getSettings(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get setting by ID
 */
async function getById(req, res, next) {
  try {
    const item = await settingsService.getSettingById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create setting
 */
async function create(req, res, next) {
  try {
    const item = await settingsService.createSetting(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update setting
 */
async function update(req, res, next) {
  try {
    const item = await settingsService.updateSetting(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete setting
 */
async function remove(req, res, next) {
  try {
    await settingsService.deleteSetting(req.params.id);
    res.json({ success: true, message: 'Setting deleted successfully' });
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
