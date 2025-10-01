const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError, ConflictError } = require('../middleware/errorHandler');

/**
 * Check for overlapping shifts for a driver
 */
async function checkDriverShiftOverlap(driverId, startTime, endTime, excludeShiftId = null) {
  let query = db('shifts')
    .where('driver_id', driverId)
    .where('status', '!=', 'CANCELLED')
    .where(function() {
      this.where(function() {
        // New shift starts during existing shift
        this.where('start_time', '<=', startTime)
          .andWhere('end_time', '>', startTime);
      }).orWhere(function() {
        // New shift ends during existing shift
        this.where('start_time', '<', endTime)
          .andWhere('end_time', '>=', endTime);
      }).orWhere(function() {
        // New shift completely contains existing shift
        this.where('start_time', '>=', startTime)
          .andWhere('end_time', '<=', endTime);
      });
    });

  if (excludeShiftId) {
    query = query.andWhere('id', '!=', excludeShiftId);
  }

  const overlapping = await query.first();

  if (overlapping) {
    throw new ConflictError(
      `Driver already has a shift from ${new Date(overlapping.start_time).toLocaleString()} to ${new Date(overlapping.end_time).toLocaleString()}`
    );
  }
}

/**
 * Get shifts list with filters
 */
async function getShifts(filters = {}) {
  const {
    page = 1,
    limit = 50,
    driver_id,
    status,
    date_from,
    date_to,
    sort_by = 'start_time',
    sort_order = 'desc'
  } = filters;
  const offset = (page - 1) * limit;

  let query = db('shifts')
    .select(
      'shifts.*',
      'drivers.full_name as driver_name',
      'user_accounts.email as driver_email'
    )
    .leftJoin('drivers', 'shifts.driver_id', 'drivers.id')
    .leftJoin('user_accounts', 'drivers.user_id', 'user_accounts.id');

  if (driver_id) {
    query = query.where('shifts.driver_id', driver_id);
  }

  if (status) {
    query = query.where('shifts.status', status);
  }

  if (date_from) {
    query = query.where('shifts.start_time', '>=', date_from);
  }

  if (date_to) {
    query = query.where('shifts.start_time', '<=', date_to);
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset(offset);

  return {
    shifts: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get shift by ID
 */
async function getShiftById(id) {
  const item = await db('shifts')
    .select(
      'shifts.*',
      'drivers.full_name as driver_name',
      'user_accounts.email as driver_email'
    )
    .leftJoin('drivers', 'shifts.driver_id', 'drivers.id')
    .leftJoin('user_accounts', 'drivers.user_id', 'user_accounts.id')
    .where('shifts.id', id)
    .first();

  if (!item) {
    throw new NotFoundError('Shift not found');
  }

  return item;
}

/**
 * Create shift
 */
async function createShift(data) {
  const { driver_id, start_time, end_time, timezone = 'UTC', status = 'DRAFT' } = data;

  // Validate times
  if (new Date(start_time) >= new Date(end_time)) {
    throw new ValidationError('Start time must be before end time');
  }

  // Check for overlapping shifts
  await checkDriverShiftOverlap(driver_id, start_time, end_time);

  const [item] = await db('shifts')
    .insert({
      driver_id,
      start_time,
      end_time,
      timezone,
      status,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return item;
}

/**
 * Update shift
 */
async function updateShift(id, data) {
  const existing = await getShiftById(id);

  // Validate status transitions
  const validTransitions = {
    DRAFT: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: []
  };

  if (data.status && !validTransitions[existing.status].includes(data.status)) {
    throw new ValidationError(
      `Cannot transition from ${existing.status} to ${data.status}`
    );
  }

  // Check overlap if times are being updated
  if (data.start_time || data.end_time) {
    const startTime = data.start_time || existing.start_time;
    const endTime = data.end_time || existing.end_time;

    if (new Date(startTime) >= new Date(endTime)) {
      throw new ValidationError('Start time must be before end time');
    }

    await checkDriverShiftOverlap(existing.driver_id, startTime, endTime, id);
  }

  const [item] = await db('shifts')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Shift not found');
  }

  return item;
}

/**
 * Delete shift
 */
async function deleteShift(id) {
  // Check if shift has associated jobs
  const jobCount = await db('jobs').where('shift_id', id).count('* as count').first();
  
  if (parseInt(jobCount.count) > 0) {
    throw new ConflictError('Cannot delete shift with associated jobs');
  }

  const deleted = await db('shifts').where({ id }).delete();

  if (!deleted) {
    throw new NotFoundError('Shift not found');
  }

  return { success: true };
}

module.exports = {
  getShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  checkDriverShiftOverlap,
};