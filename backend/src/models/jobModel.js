const { query } = require('../config/db');

/**
 * Job model - placeholder for jobs table
 * TODO: Implement CRUD operations
 */

// Table: jobs
// Columns: id, driver_id, vehicle_id, title, description, status, pickup_location,
//          delivery_location, scheduled_at, completed_at, created_at, updated_at

async function findAll() {
  // TODO: SELECT * FROM jobs
  return [];
}

async function findById(id) {
  // TODO: SELECT * FROM jobs WHERE id = $1
  return null;
}

async function findByDriverId(driverId) {
  // TODO: SELECT * FROM jobs WHERE driver_id = $1
  return [];
}

async function create(jobData) {
  // TODO: INSERT INTO jobs
  return { id: 1, ...jobData };
}

async function update(id, jobData) {
  // TODO: UPDATE jobs SET ... WHERE id = $1
  return { id, ...jobData };
}

async function updateStatus(id, status) {
  // TODO: UPDATE jobs SET status = $1 WHERE id = $2
  return { id, status };
}

module.exports = {
  findAll,
  findById,
  findByDriverId,
  create,
  update,
  updateStatus,
};