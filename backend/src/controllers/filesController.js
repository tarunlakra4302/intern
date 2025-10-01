const fileService = require('../services/fileService');

async function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'No file provided', code: 'NO_FILE' }
      });
    }

    const data = {
      entity_type: req.body.entity_type,
      entity_id: req.body.entity_id,
      category: req.body.category,
      uploaded_by: req.user.id,
    };

    const attachment = await fileService.uploadFile(data, req.file);
    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const { entity_type, entity_id } = req.query;
    
    if (!entity_type || !entity_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'entity_type and entity_id are required', code: 'MISSING_PARAMS' }
      });
    }

    const attachments = await fileService.getAttachments(entity_type, entity_id);
    res.json({ success: true, data: attachments });
  } catch (error) {
    next(error);
  }
}

async function download(req, res, next) {
  try {
    const { buffer, filename, mimeType } = await fileService.downloadAttachment(req.params.id);
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await fileService.deleteAttachment(req.params.id);
    res.json({ success: true, message: 'Attachment deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  upload,
  list,
  download,
  remove,
};