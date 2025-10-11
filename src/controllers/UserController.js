/**
 * User Controller
 * Handles user-related HTTP requests
 */
const UserService = require('../services/UserService');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/response');
const { ValidationError, NotFoundError } = require('../exceptions/AppError');
const { validatePagination } = require('../utils/validation');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllUsers(req, res) {
    const { page, limit, userType, search } = req.query;
    
    // Build query options
    const options = {};
    const where = {};
    
    if (userType) {
      where.userType = userType;
    }
    
    if (search) {
      const users = await this.userService.search(search, options);
      return sendSuccess(res, users, 'Users retrieved successfully');
    }
    
    if (Object.keys(where).length > 0) {
      options.where = where;
    }
    
    // Handle pagination
    if (page || limit) {
      const pagination = validatePagination({ page, limit });
      const result = await this.userService.getPaginated(where, pagination, options);
      return sendPaginated(res, result.data, result.pagination, 'Users retrieved successfully');
    }
    
    const users = await this.userService.getAll(options);
    sendSuccess(res, users, 'Users retrieved successfully');
  }

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserById(req, res) {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('User ID is required');
    }
    
    const user = await this.userService.getById(id);
    
    if (!user) {
      throw new NotFoundError('User');
    }
    
    sendSuccess(res, user, 'User retrieved successfully');
  }

  /**
   * Get user by UUID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserByUuid(req, res) {
    const { uuid } = req.params;
    
    if (!uuid) {
      throw new ValidationError('User UUID is required');
    }
    
    const user = await this.userService.getByUuid(uuid);
    
    if (!user) {
      throw new NotFoundError('User');
    }
    
    sendSuccess(res, user, 'User retrieved successfully');
  }

  /**
   * Create new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createUser(req, res) {
    const userData = req.body;
    
    const user = await this.userService.create(userData);
    
    // Remove password from response
    delete user.dataValues.password;
    
    sendCreated(res, user, 'User created successfully');
  }

  /**
   * Update user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUser(req, res) {
    const { id } = req.params;
    const userData = req.body;
    
    if (!id) {
      throw new ValidationError('User ID is required');
    }
    
    const user = await this.userService.update(id, userData);
    
    // Remove password from response
    delete user.dataValues.password;
    
    sendSuccess(res, user, 'User updated successfully');
  }

  /**
   * Delete user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('User ID is required');
    }
    
    await this.userService.delete(id);
    
    sendSuccess(res, null, 'User deleted successfully');
  }

  /**
   * Get user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserProfile(req, res) {
    const userId = req.user.id;
    
    const user = await this.userService.getById(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new NotFoundError('User');
    }
    
    sendSuccess(res, user, 'Profile retrieved successfully');
  }

  /**
   * Update user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserProfile(req, res) {
    const userId = req.user.id;
    const userData = req.body;
    
    // Remove sensitive fields that shouldn't be updated via profile
    delete userData.userType;
    delete userData.isEmailVerified;
    delete userData.connectBalance;
    
    const user = await this.userService.update(userId, userData);
    
    // Remove password from response
    delete user.dataValues.password;
    
    sendSuccess(res, user, 'Profile updated successfully');
  }

  /**
   * Search users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchUsers(req, res) {
    const { q: searchTerm, userType, page, limit } = req.query;
    
    if (!searchTerm) {
      throw new ValidationError('Search term is required');
    }
    
    const options = {};
    if (userType) {
      options.where = { userType };
    }
    
    if (page || limit) {
      const pagination = validatePagination({ page, limit });
      const result = await this.userService.getPaginated({}, pagination, options);
      const users = await this.userService.search(searchTerm, options);
      
      return sendPaginated(res, users, result.pagination, 'Search results retrieved successfully');
    }
    
    const users = await this.userService.search(searchTerm, options);
    sendSuccess(res, users, 'Search results retrieved successfully');
  }

  /**
   * Get user statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserStatistics(req, res) {
    const statistics = await this.userService.getStatistics();
    
    sendSuccess(res, statistics, 'User statistics retrieved successfully');
  }

  /**
   * Get users by type
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUsersByType(req, res) {
    const { type } = req.params;
    const { page, limit } = req.query;
    
    if (!type) {
      throw new ValidationError('User type is required');
    }
    
    const options = {};
    
    if (page || limit) {
      const pagination = validatePagination({ page, limit });
      const result = await this.userService.getPaginated({}, pagination, options);
      const users = await this.userService.getByType(type, options);
      
      return sendPaginated(res, users, result.pagination, 'Users retrieved successfully');
    }
    
    const users = await this.userService.getByType(type, options);
    sendSuccess(res, users, 'Users retrieved successfully');
  }
}

module.exports = UserController;
