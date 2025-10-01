const documentService = require('../services/documentService');
const fileService = require('../services/fileService');

async function getByCategory(req, res, next) {
  try {
    const { category } = req.params;
    const result = await documentService.getDocumentsByCategory(category.toUpperCase(), req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function getCounts(req, res, next) {
  try {
    const counts = await documentService.getCategoryCounts();
    res.json({ success: true, data: counts });
  } catch (error) {
    next(error);
  }
}

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file provided', code: 'NO_FILE' }
      });
    }

    const { category } = req.body;
    const document = await documentService.uploadDocument(
      category.toUpperCase(),
      req.file,
      req.user.id
    );
    
    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search term (q) is required', code: 'MISSING_QUERY' }
      });
    }

    const result = await documentService.searchDocuments(q, req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await fileService.deleteAttachment(req.params.id);
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getByCategory,
  getCounts,
  upload,
  search,
  remove,
};