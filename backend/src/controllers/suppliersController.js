const suppliersService = require('../services/suppliersService');

/**
 * List suppliers
 */
async function list(req, res, next) {
  try {
    const result = await suppliersService.getSuppliers(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get supplier by ID
 */
async function getById(req, res, next) {
  try {
    const item = await suppliersService.getSupplierById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create supplier
 */
async function create(req, res, next) {
  try {
    const item = await suppliersService.createSupplier(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update supplier
 */
async function update(req, res, next) {
  try {
    const item = await suppliersService.updateSupplier(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete supplier
 */
async function remove(req, res, next) {
  try {
    await suppliersService.deleteSupplier(req.params.id);
    res.json({ success: true, message: 'Supplier deleted successfully' });
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
