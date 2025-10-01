const db = require('../db/knex');
const idService = require('./idService');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const { NotFoundError, ValidationError, ConflictError } = require('../middleware/errorHandler');

/**
 * Generate PDF invoice
 */
async function generateInvoicePDF(invoice) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Get settings for company info
    db('settings_org').first().then(settings => {
      // Header
      doc.fontSize(20).text(settings?.company_name || 'Fleet Manager', 50, 50);
      doc.fontSize(10).text(`Invoice: ${invoice.number}`, 50, 80);
      doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, 50, 95);

      // Client details
      doc.fontSize(12).text('Bill To:', 50, 130);
      doc.fontSize(10).text(invoice.client_name, 50, 145);
      if (invoice.client_email) {
        doc.text(invoice.client_email, 50, 160);
      }

      // Job details
      doc.fontSize(12).text('Job Details:', 50, 200);
      doc.fontSize(10).text(`Job: ${invoice.job_reference || invoice.job_id}`, 50, 215);
      doc.text(`Date: ${new Date(invoice.job_date).toLocaleDateString()}`, 50, 230);

      // Items table
      let y = 270;
      doc.fontSize(10).text('Description', 50, y);
      doc.text('Qty', 300, y);
      doc.text('Unit Price', 370, y);
      doc.text('Amount', 470, y, { align: 'right', width: 80 });

      y += 20;
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 10;

      // Items
      invoice.items.forEach(item => {
        doc.text(item.product_name_snap || 'Item', 50, y);
        doc.text(item.qty.toString(), 300, y);
        doc.text(`$${parseFloat(item.unit_price).toFixed(2)}`, 370, y);
        doc.text(`$${parseFloat(item.amount).toFixed(2)}`, 470, y, { align: 'right', width: 80 });
        y += 20;
      });

      // Total
      y += 20;
      doc.moveTo(50, y).lineTo(550, y).stroke();
      y += 15;
      doc.fontSize(12).text('Total:', 370, y);
      doc.text(`$${parseFloat(invoice.total_amount).toFixed(2)}`, 470, y, { align: 'right', width: 80 });

      // Bank details
      if (settings?.bank_details_text || invoice.bank_details_text) {
        y += 50;
        doc.fontSize(10).text('Payment Details:', 50, y);
        doc.text(invoice.bank_details_text || settings.bank_details_text, 50, y + 15);
      }

      // Notes
      if (invoice.notes) {
        y += 80;
        doc.fontSize(10).text('Notes:', 50, y);
        doc.text(invoice.notes, 50, y + 15, { width: 500 });
      }

      doc.end();
    });
  });
}

/**
 * Send invoice email
 */
async function sendInvoiceEmail(invoice, pdfBuffer) {
  const settings = await db('settings_org').first();

  if (!settings?.smtp_host || !settings?.smtp_user) {
    throw new ValidationError('SMTP settings not configured');
  }

  const transporter = nodemailer.createTransporter({
    host: settings.smtp_host,
    port: settings.smtp_port || 587,
    secure: false,
    auth: {
      user: settings.smtp_user,
      pass: settings.smtp_pass,
    },
  });

  // Get admin email
  const admin = await db('user_accounts').where('role', 'ADMIN').first();

  await transporter.sendMail({
    from: settings.smtp_user,
    to: invoice.client_email,
    cc: admin?.email,
    subject: `Invoice ${invoice.number} for Job ${invoice.job_reference || invoice.job_id}`,
    text: `Please find attached invoice ${invoice.number}.\n\nTotal Amount: $${invoice.total_amount}\n\n${invoice.notes || ''}`,
    attachments: [{
      filename: `invoice-${invoice.number}.pdf`,
      content: pdfBuffer,
    }],
  });
}

/**
 * Get invoices list with filters
 */
async function getInvoices(filters = {}) {
  const {
    page = 1,
    limit = 50,
    client_id,
    status,
    date_from,
    date_to,
    sort_by = 'issue_date',
    sort_order = 'desc'
  } = filters;
  const offset = (page - 1) * limit;

  let query = db('invoices')
    .select(
      'invoices.*',
      'clients.name as client_name',
      'jobs.reference_no as job_reference'
    )
    .leftJoin('clients', 'invoices.client_id', 'clients.id')
    .leftJoin('jobs', 'invoices.job_id', 'jobs.id');

  if (client_id) {
    query = query.where('invoices.client_id', client_id);
  }

  if (status) {
    query = query.where('invoices.status', status);
  }

  if (date_from) {
    query = query.where('invoices.issue_date', '>=', date_from);
  }

  if (date_to) {
    query = query.where('invoices.issue_date', '<=', date_to);
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy(sort_by, sort_order)
    .limit(limit)
    .offset(offset);

  return {
    invoices: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

/**
 * Get invoice by ID
 */
async function getInvoiceById(id) {
  const item = await db('invoices')
    .select(
      'invoices.*',
      'clients.name as client_name',
      'clients.email as client_email',
      'jobs.reference_no as job_reference',
      'jobs.job_date'
    )
    .leftJoin('clients', 'invoices.client_id', 'clients.id')
    .leftJoin('jobs', 'invoices.job_id', 'jobs.id')
    .where('invoices.id', id)
    .first();

  if (!item) {
    throw new NotFoundError('Invoice not found');
  }

  // Get invoice items
  const items = await db('invoice_items')
    .where('invoice_id', id)
    .orderBy('id');

  item.items = items;

  return item;
}

/**
 * Create invoice from job
 */
async function createInvoiceFromJob(jobId, data = {}) {
  // Check if job exists and is completed
  const job = await db('jobs')
    .select('jobs.*', 'clients.name as client_name', 'clients.email as client_email')
    .leftJoin('clients', 'jobs.client_id', 'clients.id')
    .where('jobs.id', jobId)
    .first();

  if (!job) {
    throw new NotFoundError('Job not found');
  }

  if (job.status !== 'COMPLETED') {
    throw new ValidationError('Can only create invoice for completed jobs');
  }

  // Check if invoice already exists
  const existing = await db('invoices').where('job_id', jobId).first();
  if (existing) {
    throw new ConflictError('Invoice already exists for this job');
  }

  // Get job lines
  const jobLines = await db('job_lines')
    .select(
      'job_lines.*',
      'products.name as product_name',
      'products.unit_price'
    )
    .leftJoin('products', 'job_lines.product_id', 'products.id')
    .where('job_lines.job_id', jobId);

  if (jobLines.length === 0) {
    throw new ValidationError('Job has no lines to invoice');
  }

  return await db.transaction(async (trx) => {
    // Generate invoice number
    const invoiceNumber = await idService.getNextCode('INV');

    // Calculate total
    let totalAmount = 0;
    const items = [];

    for (const line of jobLines) {
      const unitPrice = line.unit_price || 0;
      const qty = line.qty || 1;
      const amount = unitPrice * qty;
      totalAmount += amount;

      items.push({
        job_line_id: line.id,
        product_name_snap: line.product_name || 'Item',
        qty: qty,
        unit_price: unitPrice,
        amount: amount,
        docket_no_snap: line.docket_no,
      });
    }

    // Create invoice
    const [invoice] = await trx('invoices')
      .insert({
        job_id: jobId,
        client_id: job.client_id,
        number: invoiceNumber,
        issue_date: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        currency: data.currency || 'AUD',
        notes: data.notes || '',
        bank_details_text: data.bank_details_text || '',
        total_amount: totalAmount,
        created_at: trx.fn.now(),
        updated_at: trx.fn.now(),
      })
      .returning('*');

    // Create invoice items
    for (const item of items) {
      await trx('invoice_items').insert({
        invoice_id: invoice.id,
        ...item,
        created_at: trx.fn.now(),
      });
    }

    return await getInvoiceById(invoice.id);
  });
}

/**
 * Issue invoice (generate PDF and send email)
 */
async function issueInvoice(id) {
  const invoice = await getInvoiceById(id);

  if (invoice.status !== 'DRAFT') {
    throw new ValidationError('Only draft invoices can be issued');
  }

  // Generate PDF
  const pdfBuffer = await generateInvoicePDF(invoice);

  // Send email
  await sendInvoiceEmail(invoice, pdfBuffer);

  // Update invoice
  const [updated] = await db('invoices')
    .where({ id })
    .update({
      status: 'ISSUED',
      pdf: pdfBuffer,
      email_sent_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return updated;
}

/**
 * Update invoice
 */
async function updateInvoice(id, data) {
  const existing = await getInvoiceById(id);

  if (existing.status !== 'DRAFT') {
    throw new ValidationError('Only draft invoices can be updated');
  }

  const [item] = await db('invoices')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Invoice not found');
  }

  return await getInvoiceById(id);
}

/**
 * Cancel invoice
 */
async function cancelInvoice(id) {
  const [item] = await db('invoices')
    .where({ id })
    .update({
      status: 'CANCELLED',
      updated_at: db.fn.now(),
    })
    .returning('*');

  if (!item) {
    throw new NotFoundError('Invoice not found');
  }

  return item;
}

/**
 * Download invoice PDF
 */
async function getInvoicePDF(id) {
  const invoice = await db('invoices')
    .select('pdf', 'number')
    .where('id', id)
    .first();

  if (!invoice) {
    throw new NotFoundError('Invoice not found');
  }

  if (!invoice.pdf) {
    throw new NotFoundError('Invoice PDF not generated yet');
  }

  return {
    buffer: invoice.pdf,
    filename: `invoice-${invoice.number}.pdf`,
  };
}

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoiceFromJob,
  issueInvoice,
  updateInvoice,
  cancelInvoice,
  getInvoicePDF,
};