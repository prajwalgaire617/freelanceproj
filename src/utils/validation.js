/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate pagination parameters
 * @param {Object} params - Pagination parameters
 * @returns {Object} Validated pagination
 */
const validatePagination = (params) => {
  const { page = 1, limit = 10 } = params;
  
  const validatedPage = Math.max(1, parseInt(page) || 1);
  const validatedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
  
  return {
    page: validatedPage,
    limit: validatedLimit,
    offset: (validatedPage - 1) * validatedLimit
  };
};

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} Is valid UUID
 */
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate file type
 * @param {string} mimeType - MIME type to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @returns {boolean} Is valid file type
 */
const isValidFileType = (mimeType, allowedTypes) => {
  return allowedTypes.includes(mimeType);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean} Is valid file size
 */
const isValidFileSize = (size, maxSize) => {
  return size <= maxSize;
};

/**
 * Validate required fields
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Required field names
 * @returns {Object} Validation result
 */
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data || data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isValidEmail,
  validatePassword,
  isValidPhone,
  isValidUrl,
  sanitizeString,
  validatePagination,
  isValidUUID,
  isValidFileType,
  isValidFileSize,
  validateRequiredFields
};
