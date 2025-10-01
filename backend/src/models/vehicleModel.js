const { query } = require('../config/db');

/**
 * Vehicle model - placeholder for vehicles table
 * TODO: Implement CRUD operations
 */

// Table: vehicles
// Columns: id, registration, make, model, year, status, mileage, created_at, updated_at

async function findAll() {
  // TODO: SELECT * FROM vehicles
  return [];
}

async function findById(id) {
  // TODO: SELECT * FROM vehicles WHERE id = $1
  return null;
}

async function create(vehicleData) {
  // TODO: INSERT INTO vehicles
  return { id: 1, ...vehicleData };
}

async function update(id, vehicleData) {
  // TODO: UPDATE vehicles SET ... WHERE id = $1
  return { id, ...vehicleData };
}

async function remove(id) {
  // TODO: DELETE FROM vehicles WHERE id = $1
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};