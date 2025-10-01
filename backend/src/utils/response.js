/**
 * Standardized API response formatters
 */

function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

function errorResponse(res, message, statusCode = 400, code = 'ERROR') {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
    },
  });
}

function paginatedResponse(res, data, pagination) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil(pagination.total / pagination.limit) || 0,
    },
  });
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};