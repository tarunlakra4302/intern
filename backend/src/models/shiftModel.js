const { query } = require('../config/db');

/**
 * Shift model - placeholder for shifts table
 * TODO: Implement CRUD operations
 */

// Table: shifts
// Columns: id, driver_id, vehicle_id, clock_in_time, clock_out_time,
//          total_hours, created_at, updated_at

async function findAll() {
  // TODO: SELECT * FROM shifts
  return [];
}

async function findById(id) {
  // TODO: SELECT * FROM shifts WHERE id = $1
  return null;
}

async function findByDriverId(driverId) {
  // TODO: SELECT * FROM shifts WHERE driver_id = $1
  return [];
}

async function create(shiftData) {
  // TODO: INSERT INTO shifts
  return { id: 1, ...shiftData };
}

async function update(id, shiftData) {
  // TODO: UPDATE shifts SET ... WHERE id = $1
  return { id, ...shiftData };
}

async function clockIn(driverId, vehicleId) {
  // TODO: INSERT INTO shifts (driver_id, vehicle_id, clock_in_time)
  return { id: 1, driverId, vehicleId, clockInTime: new Date() };
}

async function clockOut(shiftId) {
  // TODO: UPDATE shifts SET clock_out_time = NOW() WHERE id = $1
  return { id: shiftId, clockOutTime: new Date() };
}

module.exports = {
  findAll,
  findById,
  findByDriverId,
  create,
  update,
  clockIn,
  clockOut,
};