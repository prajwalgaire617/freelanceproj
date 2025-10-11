/**
 * Global Error Handling Middleware
 */
const { AppError } = require('../exceptions/AppError');
const { sendError } = require('../utils/response');
const { HTTP_STATUS } = require('../constants');

/**
 * Handle Sequelize validation errors
 * @param {Error} err - Sequelize validation error
 * @returns {AppError} Formatted error
 */
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(error => ({
    field: error.path,
    message: error.message,
    value: error.value
  }));
  
  return new AppError('Validation failed', HTTP_STATUS.BAD_REQUEST, true, errors);
};

/**
 * Handle Sequelize unique constraint errors
 * @param {Error} err - Sequelize unique constraint error
 * @returns {AppError} Formatted error
 */
const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0]?.path || 'field';
  const message = `${field} already exists`;
  
  return new AppError(message, HTTP_STATUS.CONFLICT, true);
};

/**
 * Handle Sequelize foreign key constraint errors
 * @param {Error} err - Sequelize foreign key constraint error
 * @returns {AppError} Formatted error
 */
const handleSequelizeForeignKeyConstraintError = (err) => {
  return new AppError('Referenced record not found', HTTP_STATUS.BAD_REQUEST, true);
};

/**
 * Handle JWT errors
 * @param {Error} err - JWT error
 * @returns {AppError} Formatted error
 */
const handleJWTError = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', HTTP_STATUS.UNAUTHORIZED, true);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Token expired', HTTP_STATUS.UNAUTHORIZED, true);
  }
  return new AppError('Authentication failed', HTTP_STATUS.UNAUTHORIZED, true);
};

/**
 * Handle Stripe errors
 * @param {Error} err - Stripe error
 * @returns {AppError} Formatted error
 */
const handleStripeError = (err) => {
  return new AppError(`Payment error: ${err.message}`, HTTP_STATUS.BAD_REQUEST, true);
};

/**
 * Send error response in development
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  sendError(res, err.message, err.statusCode, {
    error: err,
    stack: err.stack
  });
};

/**
 * Send error response in production
 * @param {Error} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    sendError(res, err.message, err.statusCode, err.errors);
  } else {
    // Programming errors: don't leak error details
    console.error('ERROR 💥', err);
    sendError(res, 'Something went wrong!', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err.name === 'SequelizeValidationError') {
    error = handleSequelizeValidationError(err);
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    error = handleSequelizeUniqueConstraintError(err);
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    error = handleSequelizeForeignKeyConstraintError(err);
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = handleJWTError(err);
  } else if (err.type && err.type.startsWith('Stripe')) {
    error = handleStripeError(err);
  }

  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = errorHandler;
