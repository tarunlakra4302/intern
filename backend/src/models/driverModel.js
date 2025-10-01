const { query } = require('../config/db');

/**
 * Driver model - placeholder for drivers table
 * TODO: Implement CRUD operations
 */

// Table: drivers
// Columns: id, name, email, phone, license_number, status, created_at, updated_at

async function findAll() {
  // TODO: SELECT * FROM drivers
  return [];
}

async function findById(id) {
  // TODO: SELECT * FROM drivers WHERE id = $1
  return null;
}

async function create(driverData) {
  // TODO: INSERT INTO drivers
  return { id: 1, ...driverData };
}

async function update(id, driverData) {
  // TODO: UPDATE drivers SET ... WHERE id = $1
  return { id, ...driverData };
}

async function remove(id) {
  // TODO: DELETE FROM drivers WHERE id = $1
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};