/**
 * User Service
 * Handles user-related business logic
 */
const BaseService = require('../core/BaseService');
const UserRepository = require('../repositories/UserRepository');
const { ValidationError, ConflictError, NotFoundError } = require('../exceptions/AppError');
const { validatePassword, isValidEmail, sanitizeString } = require('../utils/validation');
const { USER_TYPES } = require('../constants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService extends BaseService {
  constructor() {
    super(new UserRepository());
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {Object} options - Create options
   * @returns {Promise<Object>} Created user
   */
  async create(userData, options = {}) {
    // Validate and sanitize input
    this.validateCreateData(userData);
    const sanitizedData = this.sanitizeData(userData);

    // Check if user already exists
    const existingUser = await this.repository.findByEmail(sanitizedData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    if (sanitizedData.password) {
      sanitizedData.password = await bcrypt.hash(sanitizedData.password, 12);
    }

    // Set default values
    sanitizedData.connectBalance = sanitizedData.connectBalance || 0;
    sanitizedData.isEmailVerified = sanitizedData.isEmailVerified || false;

    return await this.repository.create(sanitizedData, options);
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated user
   */
  async update(id, userData, options = {}) {
    this.validateUpdateData(userData);
    const sanitizedData = this.sanitizeData(userData);

    // Hash password if provided
    if (sanitizedData.password) {
      sanitizedData.password = await bcrypt.hash(sanitizedData.password, 12);
    }

    return await super.update(id, sanitizedData, options);
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} User or null
   */
  async getByEmail(email, options = {}) {
    if (!email) {
      throw new ValidationError('Email is required');
    }

    return await this.repository.findByEmail(email, options);
  }

  /**
   * Get user by UUID
   * @param {string} uuid - User UUID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} User or null
   */
  async getByUuid(uuid, options = {}) {
    if (!uuid) {
      throw new ValidationError('UUID is required');
    }

    return await this.repository.findByUuid(uuid, options);
  }

  /**
   * Get users by type
   * @param {string} userType - User type
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  async getByType(userType, options = {}) {
    if (!Object.values(USER_TYPES).includes(userType)) {
      throw new ValidationError('Invalid user type');
    }

    return await this.repository.findByType(userType, options);
  }

  /**
   * Search users
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of matching users
   */
  async search(searchTerm, options = {}) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new ValidationError('Search term must be at least 2 characters long');
    }

    return await this.repository.search(searchTerm.trim(), options);
  }

  /**
   * Verify user password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} Password match
   */
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    } catch (error) {
      throw new ValidationError('Invalid or expired token');
    }
  }

  /**
   * Update connect balance
   * @param {number} userId - User ID
   * @param {number} amount - Amount to add/subtract
   * @param {Object} options - Transaction options
   * @returns {Promise<Object>} Updated user
   */
  async updateConnectBalance(userId, amount, options = {}) {
    if (!userId || !amount) {
      throw new ValidationError('User ID and amount are required');
    }

    return await this.repository.updateConnectBalance(userId, amount, options);
  }

  /**
   * Get user statistics
   * @param {Object} options - Query options
   * @returns {Promise<Object>} User statistics
   */
  async getStatistics(options = {}) {
    return await this.repository.getStatistics(options);
  }

  /**
   * Validate create data
   * @param {Object} data - Data to validate
   */
  validateCreateData(data) {
    super.validateCreateData(data);

    const requiredFields = ['email', 'firstName', 'lastName', 'userType'];
    const { validateRequiredFields } = require('../utils/validation');
    const validation = validateRequiredFields(data, requiredFields);

    if (!validation.isValid) {
      throw new ValidationError('Validation failed', validation.errors);
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate user type
    if (!Object.values(USER_TYPES).includes(data.userType)) {
      throw new ValidationError('Invalid user type');
    }

    // Validate password if provided
    if (data.password) {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        throw new ValidationError('Password validation failed', passwordValidation.errors);
      }
    }
  }

  /**
   * Validate update data
   * @param {Object} data - Data to validate
   */
  validateUpdateData(data) {
    super.validateUpdateData(data);

    // Validate email format if provided
    if (data.email && !isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    // Validate user type if provided
    if (data.userType && !Object.values(USER_TYPES).includes(data.userType)) {
      throw new ValidationError('Invalid user type');
    }

    // Validate password if provided
    if (data.password) {
      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        throw new ValidationError('Password validation failed', passwordValidation.errors);
      }
    }
  }

  /**
   * Sanitize data
   * @param {Object} data - Data to sanitize
   * @returns {Object} Sanitized data
   */
  sanitizeData(data) {
    const sanitized = { ...data };

    // Sanitize string fields
    if (sanitized.firstName) sanitized.firstName = sanitizeString(sanitized.firstName);
    if (sanitized.lastName) sanitized.lastName = sanitizeString(sanitized.lastName);
    if (sanitized.email) sanitized.email = sanitized.email.toLowerCase().trim();

    return sanitized;
  }
}

module.exports = UserService;
