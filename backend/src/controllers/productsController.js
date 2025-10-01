const productsService = require('../services/productsService');

/**
 * List products
 */
async function list(req, res, next) {
  try {
    const result = await productsService.getProducts(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get product by ID
 */
async function getById(req, res, next) {
  try {
    const item = await productsService.getProductById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create product
 */
async function create(req, res, next) {
  try {
    const item = await productsService.createProduct(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update product
 */
async function update(req, res, next) {
  try {
    const item = await productsService.updateProduct(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete product
 */
async function remove(req, res, next) {
  try {
    await productsService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
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
