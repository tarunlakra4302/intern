const db = require('../db/knex');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES_PER_ENTITY = 20;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Validate file
 */
function validateFile(file) {
  if (!file) {
    throw new ValidationError('No file provided');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new ValidationError('Only PDF and image files are allowed');
  }
}

/**
 * Check entity file count
 */
async function checkFileCount(entityType, entityId) {
  const [{ count }] = await db('attachments')
    .where({ entity_type: entityType, entity_id: entityId })
    .count('* as count');

  if (parseInt(count) >= MAX_FILES_PER_ENTITY) {
    throw new ValidationError(`Maximum ${MAX_FILES_PER_ENTITY} files allowed per entity`);
  }
}

/**
 * Upload file
 */
async function uploadFile(data, file) {
  const { entity_type, entity_id, category, uploaded_by } = data;

  validateFile(file);
  await checkFileCount(entity_type, entity_id);

  const [attachment] = await db('attachments')
    .insert({
      entity_type,
      entity_id,
      category,
      filename: file.originalname,
      mime_type: file.mimetype,
      size_bytes: file.size,
      data: file.buffer,
      uploaded_by,
      created_at: db.fn.now(),
    })
    .returning(['id', 'entity_type', 'entity_id', 'category', 'filename', 'mime_type', 'size_bytes', 'uploaded_by', 'created_at']);

  return attachment;
}

/**
 * Get attachments for entity
 */
async function getAttachments(entityType, entityId) {
  const attachments = await db('attachments')
    .select(['id', 'entity_type', 'entity_id', 'category', 'filename', 'mime_type', 'size_bytes', 'uploaded_by', 'created_at'])
    .where({ entity_type: entityType, entity_id: entityId })
    .orderBy('created_at', 'desc');

  return attachments;
}

/**
 * Get attachment by ID
 */
async function getAttachmentById(id) {
  const attachment = await db('attachments')
    .where({ id })
    .first();

  if (!attachment) {
    throw new NotFoundError('Attachment not found');
  }

  return attachment;
}

/**
 * Download attachment
 */
async function downloadAttachment(id) {
  const attachment = await getAttachmentById(id);

  return {
    buffer: attachment.data,
    filename: attachment.filename,
    mimeType: attachment.mime_type,
  };
}

/**
 * Delete attachment
 */
async function deleteAttachment(id) {
  const deleted = await db('attachments').where({ id }).delete();

  if (!deleted) {
    throw new NotFoundError('Attachment not found');
  }

  return { success: true };
}

/**
 * Get attachments by category
 */
async function getAttachmentsByCategory(category, filters = {}) {
  const { page = 1, limit = 50, entity_type, date_from, date_to } = filters;
  const offset = (page - 1) * limit;

  let query = db('attachments')
    .select(['id', 'entity_type', 'entity_id', 'category', 'filename', 'mime_type', 'size_bytes', 'uploaded_by', 'created_at'])
    .where({ category });

  if (entity_type) {
    query = query.where({ entity_type });
  }

  if (date_from) {
    query = query.where('created_at', '>=', date_from);
  }

  if (date_to) {
    query = query.where('created_at', '<=', date_to);
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return {
    attachments: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

module.exports = {
  uploadFile,
  getAttachments,
  getAttachmentById,
  downloadAttachment,
  deleteAttachment,
  getAttachmentsByCategory,
  validateFile,
};