/**
 * Base Repository Pattern
 * Provides common CRUD operations for all repositories
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Find all records with optional conditions
   * @param {Object} options - Sequelize options
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    try {
      return await this.model.findAll(options);
    } catch (error) {
      throw new Error(`Failed to find all ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Find one record by primary key
   * @param {number|string} id - Primary key
   * @param {Object} options - Sequelize options
   * @returns {Promise<Object|null>} Record or null
   */
  async findById(id, options = {}) {
    try {
      return await this.model.findByPk(id, options);
    } catch (error) {
      throw new Error(`Failed to find ${this.model.name} by ID ${id}: ${error.message}`);
    }
  }

  /**
   * Find one record by conditions
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Sequelize options
   * @returns {Promise<Object|null>} Record or null
   */
  async findOne(conditions, options = {}) {
    try {
      return await this.model.findOne({ where: conditions, ...options });
    } catch (error) {
      throw new Error(`Failed to find ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @param {Object} options - Sequelize options
   * @returns {Promise<Object>} Created record
   */
  async create(data, options = {}) {
    try {
      return await this.model.create(data, options);
    } catch (error) {
      throw new Error(`Failed to create ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Update records by conditions
   * @param {Object} data - Update data
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Sequelize options
   * @returns {Promise<Array>} Updated records
   */
  async update(data, conditions, options = {}) {
    try {
      return await this.model.update(data, { where: conditions, ...options });
    } catch (error) {
      throw new Error(`Failed to update ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Update record by ID
   * @param {number|string} id - Primary key
   * @param {Object} data - Update data
   * @param {Object} options - Sequelize options
   * @returns {Promise<Array>} Updated records
   */
  async updateById(id, data, options = {}) {
    try {
      return await this.update(data, { id }, options);
    } catch (error) {
      throw new Error(`Failed to update ${this.model.name} with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Delete records by conditions
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Sequelize options
   * @returns {Promise<number>} Number of deleted records
   */
  async delete(conditions, options = {}) {
    try {
      return await this.model.destroy({ where: conditions, ...options });
    } catch (error) {
      throw new Error(`Failed to delete ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Delete record by ID
   * @param {number|string} id - Primary key
   * @param {Object} options - Sequelize options
   * @returns {Promise<number>} Number of deleted records
   */
  async deleteById(id, options = {}) {
    try {
      return await this.delete({ id }, options);
    } catch (error) {
      throw new Error(`Failed to delete ${this.model.name} with ID ${id}: ${error.message}`);
    }
  }

  /**
   * Count records by conditions
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Sequelize options
   * @returns {Promise<number>} Count of records
   */
  async count(conditions = {}, options = {}) {
    try {
      return await this.model.count({ where: conditions, ...options });
    } catch (error) {
      throw new Error(`Failed to count ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Find and count records with pagination
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Sequelize options
   * @returns {Promise<Object>} Object with count and rows
   */
  async findAndCountAll(conditions = {}, options = {}) {
    try {
      return await this.model.findAndCountAll({
        where: conditions,
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to find and count ${this.model.name}: ${error.message}`);
    }
  }

  /**
   * Execute raw query
   * @param {string} query - SQL query
   * @param {Object} replacements - Query replacements
   * @param {Object} options - Query options
   * @returns {Promise<any>} Query result
   */
  async rawQuery(query, replacements = {}, options = {}) {
    try {
      const { sequelize } = require('../db');
      return await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
        ...options
      });
    } catch (error) {
      throw new Error(`Failed to execute raw query: ${error.message}`);
    }
  }
}

module.exports = BaseRepository;
