const reportService = require('../services/reportService');

async function driverTimesheet(req, res, next) {
  try {
    const { format = 'json' } = req.query;

    if (format === 'csv') {
      const csv = await reportService.exportDriverTimesheetCSV(req.query);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="driver-timesheet.csv"');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const pdf = await reportService.exportDriverTimesheetPDF(req.query);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="driver-timesheet.pdf"');
      return res.send(pdf);
    }

    const data = await reportService.generateDriverTimesheet(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function serviceList(req, res, next) {
  try {
    const { format = 'json' } = req.query;

    if (format === 'csv') {
      const csv = await reportService.exportServiceListCSV(req.query);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="service-list.csv"');
      return res.send(csv);
    }

    if (format === 'pdf') {
      const pdf = await reportService.exportServiceListPDF(req.query);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="service-list.pdf"');
      return res.send(pdf);
    }

    const data = await reportService.generateServiceList(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function jobAttachments(req, res, next) {
  try {
    const { format = 'json' } = req.query;

    if (format === 'csv') {
      const csv = await reportService.exportJobAttachmentsCSV(req.query);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="job-attachments.csv"');
      return res.send(csv);
    }

    const data = await reportService.generateJobAttachments(req.query);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function overview(req, res, next) {
  try {
    const { format = 'json' } = req.query;
    const data = await reportService.generateOverview(req.query);

    if (format === 'json') {
      return res.json({ success: true, data });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function financial(req, res, next) {
  try {
    const { format = 'json' } = req.query;
    const data = await reportService.generateFinancial(req.query);

    if (format === 'json') {
      return res.json({ success: true, data });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function fleet(req, res, next) {
  try {
    const { format = 'json' } = req.query;
    const data = await reportService.generateFleet(req.query);

    if (format === 'json') {
      return res.json({ success: true, data });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function driver(req, res, next) {
  try {
    const { format = 'json' } = req.query;
    const data = await reportService.generateDriver(req.query);

    if (format === 'json') {
      return res.json({ success: true, data });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function fuel(req, res, next) {
  try {
    const { format = 'json' } = req.query;
    const data = await reportService.generateFuel(req.query);

    if (format === 'json') {
      return res.json({ success: true, data });
    }

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  driverTimesheet,
  serviceList,
  jobAttachments,
  // New report controllers
  overview,
  financial,
  fleet,
  driver,
  fuel,
};