const { query } = require('../config/db');

/**
 * Invoice model - placeholder for invoices table
 * TODO: Implement CRUD operations
 */

// Table: invoices
// Columns: id, job_id, amount, tax, total, status, issued_at, due_at,
//          paid_at, created_at, updated_at

async function findAll() {
  // TODO: SELECT * FROM invoices
  return [];
}

async function findById(id) {
  // TODO: SELECT * FROM invoices WHERE id = $1
  return null;
}

async function findByJobId(jobId) {
  // TODO: SELECT * FROM invoices WHERE job_id = $1
  return null;
}

async function create(invoiceData) {
  // TODO: INSERT INTO invoices
  return { id: 1, ...invoiceData };
}

async function update(id, invoiceData) {
  // TODO: UPDATE invoices SET ... WHERE id = $1
  return { id, ...invoiceData };
}

async function markAsPaid(id) {
  // TODO: UPDATE invoices SET status = 'paid', paid_at = NOW() WHERE id = $1
  return { id, status: 'paid', paidAt: new Date() };
}

module.exports = {
  findAll,
  findById,
  findByJobId,
  create,
  update,
  markAsPaid,
};