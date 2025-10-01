const invoiceService = require('../services/invoiceService');

async function list(req, res, next) {
  try {
    const result = await invoiceService.getInvoices(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await invoiceService.getInvoiceById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function createFromJob(req, res, next) {
  try {
    const item = await invoiceService.createInvoiceFromJob(req.body.job_id, req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function issue(req, res, next) {
  try {
    const item = await invoiceService.issueInvoice(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await invoiceService.updateInvoice(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    const item = await invoiceService.cancelInvoice(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function downloadPDF(req, res, next) {
  try {
    const { buffer, filename } = await invoiceService.getInvoicePDF(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  createFromJob,
  issue,
  update,
  cancel,
  downloadPDF,
};