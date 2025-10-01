const db = require('../db/knex');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

/**
 * Generate Driver Timesheet Report
 */
async function generateDriverTimesheet(filters = {}) {
  const { driver_id, date_from, date_to } = filters;

  let query = db('shifts')
    .select(
      'shifts.id',
      'shifts.start_time',
      'shifts.end_time',
      'shifts.status',
      'drivers.full_name as driver_name',
      'drivers.id as driver_id'
    )
    .join('drivers', 'shifts.driver_id', 'drivers.id')
    .where('shifts.status', 'COMPLETED');

  if (driver_id) {
    query = query.where('shifts.driver_id', driver_id);
  }

  if (date_from) {
    query = query.where('shifts.start_time', '>=', date_from);
  }

  if (date_to) {
    query = query.where('shifts.start_time', '<=', date_to);
  }

  const shifts = await query.orderBy('shifts.start_time', 'desc');

  // Calculate hours for each shift
  const timesheetData = shifts.map(shift => {
    const start = new Date(shift.start_time);
    const end = new Date(shift.end_time);
    const totalHours = (end - start) / (1000 * 60 * 60);
    const regularHours = Math.min(totalHours, 8);
    const overtimeHours = Math.max(totalHours - 8, 0);

    return {
      driver_name: shift.driver_name,
      date: start.toLocaleDateString('en-AU'),
      shift_start: start.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      shift_end: end.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      total_hours: totalHours.toFixed(2),
      regular_hours: regularHours.toFixed(2),
      overtime_hours: overtimeHours.toFixed(2),
    };
  });

  return timesheetData;
}

/**
 * Export Driver Timesheet as CSV
 */
async function exportDriverTimesheetCSV(filters) {
  const data = await generateDriverTimesheet(filters);

  const fields = [
    { label: 'Driver', value: 'driver_name' },
    { label: 'Date', value: 'date' },
    { label: 'Shift Start', value: 'shift_start' },
    { label: 'Shift End', value: 'shift_end' },
    { label: 'Total Hours', value: 'total_hours' },
    { label: 'Regular Hours', value: 'regular_hours' },
    { label: 'Overtime Hours', value: 'overtime_hours' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(data);
}

/**
 * Export Driver Timesheet as PDF
 */
async function exportDriverTimesheetPDF(filters) {
  const data = await generateDriverTimesheet(filters);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Driver Timesheet Report', 50, 50);
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString('en-AU')}`, 50, 80);

    if (filters.date_from || filters.date_to) {
      const from = filters.date_from ? new Date(filters.date_from).toLocaleDateString('en-AU') : 'Start';
      const to = filters.date_to ? new Date(filters.date_to).toLocaleDateString('en-AU') : 'End';
      doc.text(`Period: ${from} - ${to}`, 50, 95);
    }

    // Table headers
    let y = 130;
    doc.fontSize(9);
    doc.text('Driver', 50, y);
    doc.text('Date', 150, y);
    doc.text('Start', 230, y);
    doc.text('End', 290, y);
    doc.text('Total', 350, y);
    doc.text('Regular', 410, y);
    doc.text('OT', 480, y);

    y += 15;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    // Data rows
    data.forEach(row => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(row.driver_name, 50, y, { width: 90, ellipsis: true });
      doc.text(row.date, 150, y);
      doc.text(row.shift_start, 230, y);
      doc.text(row.shift_end, 290, y);
      doc.text(row.total_hours, 350, y);
      doc.text(row.regular_hours, 410, y);
      doc.text(row.overtime_hours, 480, y);
      y += 20;
    });

    // Totals
    const totalHours = data.reduce((sum, row) => sum + parseFloat(row.total_hours), 0);
    const totalRegular = data.reduce((sum, row) => sum + parseFloat(row.regular_hours), 0);
    const totalOT = data.reduce((sum, row) => sum + parseFloat(row.overtime_hours), 0);

    y += 20;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 15;
    doc.fontSize(10).text('Totals:', 50, y);
    doc.text(totalHours.toFixed(2), 350, y);
    doc.text(totalRegular.toFixed(2), 410, y);
    doc.text(totalOT.toFixed(2), 480, y);

    doc.end();
  });
}

/**
 * Generate Service List Report
 */
async function generateServiceList(filters = {}) {
  const { status, due_within_days } = filters;

  let query = db('vehicles')
    .select(
      'id',
      'internal_id',
      'rego_number',
      'make',
      'model',
      'rego_expiry',
      'service_due_date',
      'km_to_next_service',
      'status'
    );

  if (status) {
    query = query.where({ status });
  }

  if (due_within_days) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(due_within_days));
    query = query.where('service_due_date', '<=', futureDate.toISOString().split('T')[0]);
  }

  const vehicles = await query.orderBy('service_due_date', 'asc');

  return vehicles.map(v => ({
    vehicle_id: v.internal_id || v.id,
    rego: v.rego_number,
    make_model: `${v.make} ${v.model}`,
    rego_expiry: v.rego_expiry ? new Date(v.rego_expiry).toLocaleDateString('en-AU') : 'N/A',
    service_due: v.service_due_date ? new Date(v.service_due_date).toLocaleDateString('en-AU') : 'N/A',
    km_to_service: v.km_to_next_service || 'N/A',
    status: v.status,
  }));
}

/**
 * Export Service List as CSV
 */
async function exportServiceListCSV(filters) {
  const data = await generateServiceList(filters);

  const fields = [
    { label: 'Vehicle ID', value: 'vehicle_id' },
    { label: 'Rego', value: 'rego' },
    { label: 'Make/Model', value: 'make_model' },
    { label: 'Rego Expiry', value: 'rego_expiry' },
    { label: 'Service Due', value: 'service_due' },
    { label: 'KM to Service', value: 'km_to_service' },
    { label: 'Status', value: 'status' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(data);
}

/**
 * Export Service List as PDF
 */
async function exportServiceListPDF(filters) {
  const data = await generateServiceList(filters);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, layout: 'landscape' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Service List Report', 50, 50);
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleString('en-AU')}`, 50, 80);

    let y = 120;
    doc.fontSize(9);
    doc.text('Vehicle', 50, y);
    doc.text('Rego', 150, y);
    doc.text('Make/Model', 230, y);
    doc.text('Rego Expiry', 380, y);
    doc.text('Service Due', 480, y);
    doc.text('KM', 580, y);
    doc.text('Status', 650, y);

    y += 15;
    doc.moveTo(50, y).lineTo(750, y).stroke();
    y += 10;

    data.forEach(row => {
      if (y > 500) {
        doc.addPage();
        y = 50;
      }

      doc.text(row.vehicle_id, 50, y, { width: 90, ellipsis: true });
      doc.text(row.rego, 150, y);
      doc.text(row.make_model, 230, y, { width: 140, ellipsis: true });
      doc.text(row.rego_expiry, 380, y);
      doc.text(row.service_due, 480, y);
      doc.text(String(row.km_to_service), 580, y);
      doc.text(row.status, 650, y);
      y += 20;
    });

    doc.end();
  });
}

/**
 * Generate Job Attachments Report
 */
async function generateJobAttachments(filters = {}) {
  const { date_from, date_to, client_id, category } = filters;

  let query = db('attachments')
    .select(
      'attachments.id',
      'attachments.filename',
      'attachments.category',
      'attachments.created_at',
      'attachments.entity_id',
      'jobs.reference_no as job_reference',
      'clients.name as client_name',
      'user_accounts.email as uploaded_by_email'
    )
    .join('jobs', function() {
      this.on('attachments.entity_id', '=', 'jobs.id')
        .andOn('attachments.entity_type', '=', db.raw('?', ['JOB']));
    })
    .leftJoin('clients', 'jobs.client_id', 'clients.id')
    .leftJoin('user_accounts', 'attachments.uploaded_by', 'user_accounts.id');

  if (date_from) {
    query = query.where('attachments.created_at', '>=', date_from);
  }

  if (date_to) {
    query = query.where('attachments.created_at', '<=', date_to);
  }

  if (client_id) {
    query = query.where('jobs.client_id', client_id);
  }

  if (category) {
    query = query.where('attachments.category', category);
  }

  const attachments = await query.orderBy('attachments.created_at', 'desc');

  return attachments.map(a => ({
    job_reference: a.job_reference,
    client_name: a.client_name,
    category: a.category,
    filename: a.filename,
    uploaded_by: a.uploaded_by_email,
    uploaded_at: new Date(a.created_at).toLocaleString('en-AU'),
  }));
}

/**
 * Export Job Attachments as CSV
 */
async function exportJobAttachmentsCSV(filters) {
  const data = await generateJobAttachments(filters);

  const fields = [
    { label: 'Job Reference', value: 'job_reference' },
    { label: 'Client', value: 'client_name' },
    { label: 'Category', value: 'category' },
    { label: 'Filename', value: 'filename' },
    { label: 'Uploaded By', value: 'uploaded_by' },
    { label: 'Uploaded At', value: 'uploaded_at' },
  ];

  const parser = new Parser({ fields });
  return parser.parse(data);
}

/**
 * Generate Overview Report
 */
async function generateOverview(filters = {}) {
  const { date_from, date_to } = filters;

  // Get KPIs
  const jobs = await db('jobs').count('* as count');
  const activeJobs = await db('jobs').where('status', 'IN_PROGRESS').count('* as count');
  const completedJobs = await db('jobs').where('status', 'COMPLETED').count('* as count');

  const invoices = await db('invoices').sum('amount as total');
  const totalRevenue = invoices[0]?.total || 0;

  const expenses = await db('expenses').sum('amount as total');
  const totalExpenses = expenses[0]?.total || 0;

  const vehicles = await db('vehicles').count('* as count');
  const activeVehicles = await db('vehicles').where('status', 'ACTIVE').count('* as count');

  // Get revenue trend (last 6 months)
  const revenueData = await db('invoices')
    .select(db.raw("TO_CHAR(created_at, 'Mon') as month"))
    .sum('amount as revenue')
    .groupBy(db.raw("TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)"))
    .orderBy(db.raw("EXTRACT(MONTH FROM created_at)"))
    .limit(6);

  // Get job status distribution
  const jobsByStatus = await db('jobs')
    .select('status')
    .count('* as count')
    .groupBy('status');

  return {
    kpis: {
      totalRevenue,
      netProfit: totalRevenue - totalExpenses,
      activeJobs: activeJobs[0]?.count || 0,
      fleetUtilization: vehicles[0]?.count > 0 ? Math.round((activeVehicles[0]?.count / vehicles[0]?.count) * 100) : 0
    },
    revenueData,
    jobsByStatus
  };
}

/**
 * Generate Financial Report
 */
async function generateFinancial(filters = {}) {
  const { date_from, date_to } = filters;

  let invoiceQuery = db('invoices').select(
    db.raw("TO_CHAR(created_at, 'Mon') as month"),
    db.raw("SUM(amount) as revenue")
  ).groupBy(db.raw("TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)"))
    .orderBy(db.raw("EXTRACT(MONTH FROM created_at)"));

  let expenseQuery = db('expenses').select(
    'category',
    db.raw("SUM(amount) as amount")
  ).groupBy('category');

  if (date_from) {
    invoiceQuery = invoiceQuery.where('created_at', '>=', date_from);
    expenseQuery = expenseQuery.where('expense_date', '>=', date_from);
  }

  if (date_to) {
    invoiceQuery = invoiceQuery.where('created_at', '<=', date_to);
    expenseQuery = expenseQuery.where('expense_date', '<=', date_to);
  }

  const revenueData = await invoiceQuery;
  const expenseBreakdown = await expenseQuery;

  return {
    revenueData,
    expenseBreakdown
  };
}

/**
 * Generate Fleet Report
 */
async function generateFleet(filters = {}) {
  const { status } = filters;

  let query = db('vehicles').select('status').count('* as count').groupBy('status');

  if (status) {
    query = query.where({ status });
  }

  const fleetUtilization = await query;

  // Top performing vehicles
  const topVehicles = await db('jobs')
    .select(
      'vehicles.id',
      'vehicles.rego_number',
      'vehicles.make',
      'vehicles.model'
    )
    .count('jobs.id as job_count')
    .join('vehicles', 'jobs.vehicle_id', 'vehicles.id')
    .groupBy('vehicles.id', 'vehicles.rego_number', 'vehicles.make', 'vehicles.model')
    .orderBy('job_count', 'desc')
    .limit(5);

  return {
    fleetUtilization,
    topVehicles
  };
}

/**
 * Generate Driver Performance Report
 */
async function generateDriver(filters = {}) {
  const { driver_id, date_from, date_to } = filters;

  let query = db('shifts')
    .select(
      'drivers.id',
      'drivers.full_name',
      db.raw('COUNT(shifts.id) as total_shifts'),
      db.raw('SUM(EXTRACT(EPOCH FROM (shifts.end_time - shifts.start_time))/3600) as total_hours')
    )
    .join('drivers', 'shifts.driver_id', 'drivers.id')
    .where('shifts.status', 'COMPLETED')
    .groupBy('drivers.id', 'drivers.full_name')
    .orderBy('total_hours', 'desc')
    .limit(10);

  if (driver_id) {
    query = query.where('drivers.id', driver_id);
  }

  if (date_from) {
    query = query.where('shifts.start_time', '>=', date_from);
  }

  if (date_to) {
    query = query.where('shifts.start_time', '<=', date_to);
  }

  const driverPerformance = await query;

  // Get job count per driver
  const jobCounts = await db('jobs')
    .select('driver_id')
    .count('* as jobs')
    .groupBy('driver_id');

  return {
    driverPerformance: driverPerformance.map(d => ({
      ...d,
      jobs: jobCounts.find(j => j.driver_id === d.id)?.jobs || 0,
      total_hours: parseFloat(d.total_hours || 0).toFixed(2)
    }))
  };
}

/**
 * Generate Fuel Consumption Report
 */
async function generateFuel(filters = {}) {
  const { vehicle_id, date_from, date_to } = filters;

  let query = db('fuel_entries')
    .select(
      db.raw("TO_CHAR(filled_at, 'Week WW') as week"),
      db.raw("SUM(liters) as total_liters"),
      db.raw("SUM(amount) as total_cost")
    )
    .groupBy(db.raw("TO_CHAR(filled_at, 'Week WW'), EXTRACT(WEEK FROM filled_at)"))
    .orderBy(db.raw("EXTRACT(WEEK FROM filled_at)"))
    .limit(4);

  if (vehicle_id) {
    query = query.where('vehicle_id', vehicle_id);
  }

  if (date_from) {
    query = query.where('filled_at', '>=', date_from);
  }

  if (date_to) {
    query = query.where('filled_at', '<=', date_to);
  }

  const fuelConsumption = await query;

  // Get total fuel stats
  const totalStats = await db('fuel_entries')
    .sum('liters as total_liters')
    .sum('amount as total_cost')
    .avg('amount as avg_cost_per_liter')
    .first();

  return {
    fuelConsumption,
    totalStats: {
      totalCost: parseFloat(totalStats.total_cost || 0).toFixed(2),
      totalLiters: parseFloat(totalStats.total_liters || 0).toFixed(2),
      avgCostPerLiter: parseFloat(totalStats.avg_cost_per_liter || 0).toFixed(2)
    }
  };
}

module.exports = {
  generateDriverTimesheet,
  exportDriverTimesheetCSV,
  exportDriverTimesheetPDF,
  generateServiceList,
  exportServiceListCSV,
  exportServiceListPDF,
  generateJobAttachments,
  exportJobAttachmentsCSV,
  // New report functions
  generateOverview,
  generateFinancial,
  generateFleet,
  generateDriver,
  generateFuel,
};