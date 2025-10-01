const { query } = require('../config/db');

/**
 * Document model - placeholder for documents table
 * TODO: Implement CRUD operations
 */

// Table: documents
// Columns: id, driver_id, type, file_name, file_path, file_size,
//          uploaded_at, expires_at, created_at, updated_at

async function findAll() {
  // TODO: SELECT * FROM documents
  return [];
}

async function findById(id) {
  // TODO: SELECT * FROM documents WHERE id = $1
  return null;
}

async function findByDriverId(driverId) {
  // TODO: SELECT * FROM documents WHERE driver_id = $1
  return [];
}

async function create(documentData) {
  // TODO: INSERT INTO documents
  return { id: 1, ...documentData };
}

async function update(id, documentData) {
  // TODO: UPDATE documents SET ... WHERE id = $1
  return { id, ...documentData };
}

async function remove(id) {
  // TODO: DELETE FROM documents WHERE id = $1
  return true;
}

module.exports = {
  findAll,
  findById,
  findByDriverId,
  create,
  update,
  remove,
};