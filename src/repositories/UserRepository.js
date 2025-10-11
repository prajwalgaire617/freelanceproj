/**
 * User Repository
 * Handles all user-related database operations
 */
const BaseRepository = require('../core/BaseRepository');
const { User } = require('../db');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} User or null
   */
  async findByEmail(email, options = {}) {
    try {
      return await this.model.findOne({
        where: { email },
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  /**
   * Find user by UUID
   * @param {string} uuid - User UUID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} User or null
   */
  async findByUuid(uuid, options = {}) {
    try {
      return await this.model.findOne({
        where: { uuid },
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to find user by UUID: ${error.message}`);
    }
  }

  /**
   * Find users by type
   * @param {string} userType - User type
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of users
   */
  async findByType(userType, options = {}) {
    try {
      return await this.model.findAll({
        where: { userType },
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to find users by type: ${error.message}`);
    }
  }

  /**
   * Find verified users
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of verified users
   */
  async findVerified(options = {}) {
    try {
      return await this.model.findAll({
        where: { isEmailVerified: true },
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to find verified users: ${error.message}`);
    }
  }

  /**
   * Update user's connect balance
   * @param {number} userId - User ID
   * @param {number} amount - Amount to add/subtract
   * @param {Object} options - Transaction options
   * @returns {Promise<Object>} Updated user
   */
  async updateConnectBalance(userId, amount, options = {}) {
    try {
      const user = await this.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const newBalance = Math.max(0, user.connectBalance + amount);
      
      return await this.updateById(userId, { connectBalance: newBalance }, options);
    } catch (error) {
      throw new Error(`Failed to update connect balance: ${error.message}`);
    }
  }

  /**
   * Search users by name or email
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of matching users
   */
  async search(searchTerm, options = {}) {
    try {
      const { Op } = require('sequelize');
      
      return await this.model.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${searchTerm}%` } },
            { lastName: { [Op.iLike]: `%${searchTerm}%` } },
            { email: { [Op.iLike]: `%${searchTerm}%` } }
          ]
        },
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  /**
   * Get user statistics
   * @param {Object} options - Query options
   * @returns {Promise<Object>} User statistics
   */
  async getStatistics(options = {}) {
    try {
      const { Op } = require('sequelize');
      
      const [
        totalUsers,
        freelancers,
        clients,
        agencies,
        verifiedUsers,
        recentUsers
      ] = await Promise.all([
        this.count(),
        this.count({ userType: 'freelancer' }),
        this.count({ userType: 'client' }),
        this.count({ userType: 'agency' }),
        this.count({ isEmailVerified: true }),
        this.count({
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        })
      ]);

      return {
        totalUsers,
        freelancers,
        clients,
        agencies,
        verifiedUsers,
        recentUsers,
        verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0
      };
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }
}

module.exports = UserRepository;
