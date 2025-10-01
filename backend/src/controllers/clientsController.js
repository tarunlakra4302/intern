const clientsService = require('../services/clientsService');

/**
 * List clients
 */
async function list(req, res, next) {
  try {
    const result = await clientsService.getClients(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

/**
 * Get client by ID
 */
async function getById(req, res, next) {
  try {
    const item = await clientsService.getClientById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Create client
 */
async function create(req, res, next) {
  try {
    const item = await clientsService.createClient(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Update client
 */
async function update(req, res, next) {
  try {
    const item = await clientsService.updateClient(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete client
 */
async function remove(req, res, next) {
  try {
    await clientsService.deleteClient(req.params.id);
    res.json({ success: true, message: 'Client deleted successfully' });
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
