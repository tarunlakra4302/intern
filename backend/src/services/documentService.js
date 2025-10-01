const db = require('../db/knex');
const fileService = require('./fileService');

const DOCUMENT_CATEGORIES = [
  'BUSINESS',
  'RISK_ASSESSMENT',
  'TOOLBOX',
  'TRAINING',
  'PERMITS',
  'AUDITS',
  'JOB_ACTIVITIES'
];

/**
 * Get documents by category
 */
async function getDocumentsByCategory(category, filters = {}) {
  if (!DOCUMENT_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category. Must be one of: ${DOCUMENT_CATEGORIES.join(', ')}`);
  }

  return await fileService.getAttachmentsByCategory('DOCUMENT', {
    ...filters,
    entity_type: 'DOCUMENT',
  });
}

/**
 * Get all categories with counts
 */
async function getCategoryCounts() {
  const counts = await db('attachments')
    .select('category')
    .where('entity_type', 'DOCUMENT')
    .count('* as count')
    .groupBy('category');

  const result = {};
  DOCUMENT_CATEGORIES.forEach(cat => {
    const found = counts.find(c => c.category === 'DOCUMENT');
    result[cat] = found ? parseInt(found.count) : 0;
  });

  return result;
}

/**
 * Upload document
 */
async function uploadDocument(category, file, uploadedBy) {
  if (!DOCUMENT_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category. Must be one of: ${DOCUMENT_CATEGORIES.join(', ')}`);
  }

  // Use a fixed entity_id for documents (they're not tied to specific entities)
  const data = {
    entity_type: 'DOCUMENT',
    entity_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
    category: 'DOCUMENT',
    uploaded_by: uploadedBy,
  };

  return await fileService.uploadFile(data, file);
}

/**
 * Search documents
 */
async function searchDocuments(searchTerm, filters = {}) {
  const { page = 1, limit = 50, category } = filters;
  const offset = (page - 1) * limit;

  let query = db('attachments')
    .select(['id', 'category', 'filename', 'mime_type', 'size_bytes', 'uploaded_by', 'created_at'])
    .where('entity_type', 'DOCUMENT')
    .where('filename', 'ilike', `%${searchTerm}%`);

  if (category) {
    query = query.where({ category });
  }

  const [{ count }] = await query.clone().count('* as count');
  const items = await query
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return {
    documents: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: parseInt(count),
      pages: Math.ceil(count / limit),
    },
  };
}

module.exports = {
  getDocumentsByCategory,
  getCategoryCounts,
  uploadDocument,
  searchDocuments,
  DOCUMENT_CATEGORIES,
};