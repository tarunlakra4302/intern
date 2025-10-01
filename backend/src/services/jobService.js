const db = require('../db/knex');
const idService = require('./idService');
const { NotFoundError, ValidationError, ConflictError } = require('../middleware/errorHandler');

/**
 * Check for job line conflicts (driver/vehicle overlaps within same shift)
 */
async function checkJobLineConflicts(jobId, lineData, excludeLineId = null) {
  // Get the job's shift
  const job = await db('jobs').where('id', jobId).first();
  if (!job) {
    throw new NotFoundError('Job not found');
  }

  const { pickup_time, delivery_time, driver_id, vehicle_id } = lineData;

  // Check driver overlap within the same shift
  if (driver_id) {
    let driverQuery = db('job_lines as jl')
      .join('jobs as j', 'jl.job_id', 'j.id')
      .where('j.shift_id', job.shift_id)
      .where('jl.driver_id', driver_id)
      .where(function() {
        this.where(function() {
          this.where('jl.pickup_time', '<=', pickup_time)
            .andWhere('jl.delivery_time', '>', pickup_time);
        }).orWhere(function() {
          this.where('jl.pickup_time', '<', delivery_time)
            .andWhere('jl.delivery_time', '>=', delivery_time);
        }).orWhere(function() {
          this.where('jl.pickup_time', '>=', pickup_time)
            .andWhere('jl.delivery_time', '<=', delivery_time);
        });
      });

    if (excludeLineId) {
      driverQuery = driverQuery.andWhere('jl.id', '!=', excludeLineId);
    }

    const driverConflict = await driverQuery.select('jl.*', 'j.id as job_id').first();

    if (driverConflict) {
      throw new ConflictError(
        `Driver ${driver_id} is booked ${driverConflict.pickup_time}–${driverConflict.delivery_time} on JOB-${driverConflict.job_id}, line ${driverConflict.id}`
      );
    }
  }

  // Check vehicle overlap within the same shift
  if (vehicle_id) {
    let vehicleQuery = db('job_lines as jl')
      .join('jobs as j', 'jl.job_id', 'j.id')
      .where('j.shift_id', job.shift_id)
      .where('jl.vehicle_id', vehicle_id)
      .where(function() {
        this.where(function() {
          this.where('jl.pickup_time', '<=', pickup_time)
            .andWhere('jl.delivery_time', '>', pickup_time);
        }).orWhere(function() {
          this.where('jl.pickup_time', '<', delivery_time)
            .andWhere('jl.delivery_time', '>=', delivery_time);
        }).orWhere(function() {
          this.where('jl.pickup_time', '>=', pickup_time)
            .andWhere('jl.delivery_time', '<=', delivery_time);
        });
      });

    if (excludeLineId) {
      vehicleQuery = vehicleQuery.andWhere('jl.id', '!=', excludeLineId);
    }

    const vehicleConflict = await vehicleQuery.select('jl.*', 'j.id as job_id').first();

    if (vehicleConflict) {
      throw new ConflictError(
        `Vehicle ${vehicle_id} is booked ${vehicleConflict.pickup_time}–${vehicleConflict.delivery_time} on JOB-${vehicleConflict.job_id}, line ${vehicleConflict.id}`
      );
    }
  }
}

/**
 * Get jobs list with filters
 */
async function getJobs(filters = {}) {
  const {
    page = 1,
    limit = 50,
    shift_id,
    client_id,
    status,
    date_from,
    date_to,
    sort_by = 'job_date',
    sort_order = 'desc'
  } = filters;
  const offset = (page - 1) * limit;

  let query = db('jobs')
    .select(
      'jobs.*',
      'clients.name as client_name',
      'shifts.driver_id'
    )
    .leftJoin('clients', 'jobs.client_id', 'clients.id')
    .leftJoin('shifts', 'jobs.shift_id', 'shifts.id');

  if (shift_id) {
    query = query.where('jobs.shift_id', shift_id);
  }

  if (client_id) {
    query = query.where('jobs.client_id', client_id);
  }

  if (status) {
    query = query.where('jobs.status', status);
  }

  if (date_from) {
    query = query.where('jobs.job_date', '>=', date_from);
  }

  if (date_to) {
    query = query.where('jobs.job_date', '<=', date_to);
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset(offset);

  return {
    jobs: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get job by ID with lines
 */
async function getJobById(id) {
  const item = await db('jobs')
    .select(
      'jobs.*',
      'clients.name as client_name',
      'clients.email as client_email'
    )
    .leftJoin('clients', 'jobs.client_id', 'clients.id')
    .where('jobs.id', id)
    .first();

  if (!item) {
    throw new NotFoundError('Job not found');
  }

  // Get job lines
  const lines = await db('job_lines')
    .select(
      'job_lines.*',
      'drivers.full_name as driver_name',
      'vehicles.rego_number as vehicle_rego',
      'trailers.rego_number as trailer_rego',
      'products.name as product_name'
    )
    .leftJoin('drivers', 'job_lines.driver_id', 'drivers.id')
    .leftJoin('vehicles', 'job_lines.vehicle_id', 'vehicles.id')
    .leftJoin('trailers', 'job_lines.trailer_id', 'trailers.id')
    .leftJoin('products', 'job_lines.product_id', 'products.id')
    .where('job_lines.job_id', id)
    .orderBy('job_lines.id');

  item.lines = lines;

  return item;
}

/**
 * Create job with lines
 */
async function createJob(data) {
  const { shift_id, client_id, job_date, reference_no, pickup_address, delivery_address, distance_km, internal_notes, lines = [] } = data;

  // Validate shift exists
  const shift = await db('shifts').where('id', shift_id).first();
  if (!shift) {
    throw new NotFoundError('Shift not found');
  }

  return await db.transaction(async (trx) => {
    // Create job
    const [job] = await trx('jobs')
      .insert({
        shift_id,
        client_id,
        job_date,
        reference_no,
        pickup_address,
        delivery_address,
        distance_km,
        internal_notes,
        status: 'DRAFT',
        created_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      })
      .returning('*');

    // Create job lines if provided
    if (lines.length > 0) {
      for (const lineData of lines) {
        await checkJobLineConflicts(job.id, lineData);
        
        await trx('job_lines').insert({
          job_id: job.id,
          pickup_time: lineData.pickup_time,
          delivery_time: lineData.delivery_time,
          product_id: lineData.product_id,
          docket_no: lineData.docket_no,
          qty: lineData.qty || 1,
          driver_id: lineData.driver_id,
          vehicle_id: lineData.vehicle_id,
          trailer_id: lineData.trailer_id,
          created_at: trx.fn.now(),
          updated_at: trx.fn.now(),
        });
      }
    }

    return await getJobById(job.id);
  });
}

/**
 * Update job
 */
async function updateJob(id, data) {
  const { status, ...updateData } = data;

  // Validate status transitions
  if (status) {
    const existing = await getJobById(id);
    const validTransitions = {
      DRAFT: ['ASSIGNED', 'CANCELLED'],
      ASSIGNED: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: []
    };

    if (!validTransitions[existing.status].includes(status)) {
      throw new ValidationError(
        `Cannot transition from ${existing.status} to ${status}`
      );
    }
  }

  const [item] = await db('jobs')
    .where({ id })
    .update({
      ...updateData,
      ...(status && { status }),
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Job not found');
  }

  return await getJobById(id);
}

/**
 * Add job line
 */
async function addJobLine(jobId, lineData) {
  await checkJobLineConflicts(jobId, lineData);

  const [line] = await db('job_lines')
    .insert({
      job_id: jobId,
      ...lineData,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return line;
}

/**
 * Update job line
 */
async function updateJobLine(lineId, lineData) {
  const existing = await db('job_lines').where('id', lineId).first();
  if (!existing) {
    throw new NotFoundError('Job line not found');
  }

  await checkJobLineConflicts(existing.job_id, lineData, lineId);

  const [line] = await db('job_lines')
    .where({ id: lineId })
    .update({
      ...lineData,
      updated_at: db.fn.now(),
    })
    .returning('*');

  return line;
}

/**
 * Delete job line
 */
async function deleteJobLine(lineId) {
  const deleted = await db('job_lines').where({ id: lineId }).delete();

  if (!deleted) {
    throw new NotFoundError('Job line not found');
  }

  return { success: true };
}

/**
 * Delete job
 */
async function deleteJob(id) {
  // Check if job has an invoice
  const invoice = await db('invoices').where('job_id', id).first();
  if (invoice) {
    throw new ConflictError('Cannot delete job with associated invoice');
  }

  return await db.transaction(async (trx) => {
    // Delete job lines first
    await trx('job_lines').where('job_id', id).delete();
    
    // Delete job
    const deleted = await trx('jobs').where({ id }).delete();

    if (!deleted) {
      throw new NotFoundError('Job not found');
    }

    return { success: true };
  });
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  addJobLine,
  updateJobLine,
  deleteJobLine,
  checkJobLineConflicts,
};