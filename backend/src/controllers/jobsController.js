const jobService = require('../services/jobService');

async function list(req, res, next) {
  try {
    const result = await jobService.getJobs(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const item = await jobService.getJobById(req.params.id);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const item = await jobService.createJob(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const item = await jobService.updateJob(req.params.id, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await jobService.deleteJob(req.params.id);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function addLine(req, res, next) {
  try {
    const item = await jobService.addJobLine(req.params.id, req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function updateLine(req, res, next) {
  try {
    const item = await jobService.updateJobLine(req.params.lineId, req.body);
    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

async function removeLine(req, res, next) {
  try {
    await jobService.deleteJobLine(req.params.lineId);
    res.json({ success: true, message: 'Job line deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  addLine,
  updateLine,
  removeLine,
};