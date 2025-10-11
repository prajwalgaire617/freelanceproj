/**
 * Base Service Pattern
 * Provides common business logic operations for all services
 */
class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Get all records
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of records
   */
  async getAll(options = {}) {
    return await this.repository.findAll(options);
  }

  /**
   * Get record by ID
   * @param {number|string} id - Record ID
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Record or null
   */
  async getById(id, options = {}) {
    if (!id) {
      throw new Error('ID is required');
    }
    return await this.repository.findById(id, options);
  }

  /**
   * Get record by conditions
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Query options
   * @returns {Promise<Object|null>} Record or null
   */
  async getOne(conditions, options = {}) {
    return await this.repository.findOne(conditions, options);
  }

  /**
   * Create new record
   * @param {Object} data - Record data
   * @param {Object} options - Create options
   * @returns {Promise<Object>} Created record
   */
  async create(data, options = {}) {
    this.validateCreateData(data);
    return await this.repository.create(data, options);
  }

  /**
   * Update record by ID
   * @param {number|string} id - Record ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated record
   */
  async update(id, data, options = {}) {
    if (!id) {
      throw new Error('ID is required');
    }
    
    this.validateUpdateData(data);
    
    const [updatedRows] = await this.repository.updateById(id, data, options);
    
    if (updatedRows === 0) {
      throw new Error('Record not found or no changes made');
    }
    
    return await this.getById(id, options);
  }

  /**
   * Delete record by ID
   * @param {number|string} id - Record ID
   * @param {Object} options - Delete options
   * @returns {Promise<boolean>} Success status
   */
  async delete(id, options = {}) {
    if (!id) {
      throw new Error('ID is required');
    }
    
    const deletedRows = await this.repository.deleteById(id, options);
    
    if (deletedRows === 0) {
      throw new Error('Record not found');
    }
    
    return true;
  }

  /**
   * Get paginated results
   * @param {Object} conditions - Where conditions
   * @param {Object} pagination - Pagination options
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated results
   */
  async getPaginated(conditions = {}, pagination = {}, options = {}) {
    const { page = 1, limit = 10, offset } = pagination;
    const actualOffset = offset !== undefined ? offset : (page - 1) * limit;
    
    const queryOptions = {
      ...options,
      limit: parseInt(limit),
      offset: parseInt(actualOffset),
      distinct: true,
      subQuery: false
    };
    
    const result = await this.repository.findAndCountAll(conditions, queryOptions);
    
    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.count,
        pages: Math.ceil(result.count / limit)
      }
    };
  }

  /**
   * Check if record exists
   * @param {number|string} id - Record ID
   * @returns {Promise<boolean>} Exists status
   */
  async exists(id) {
    const record = await this.getById(id);
    return !!record;
  }

  /**
   * Get count of records
   * @param {Object} conditions - Where conditions
   * @param {Object} options - Query options
   * @returns {Promise<number>} Count of records
   */
  async count(conditions = {}, options = {}) {
    return await this.repository.count(conditions, options);
  }

  /**
   * Validate create data (to be overridden by subclasses)
   * @param {Object} data - Data to validate
   */
  validateCreateData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided');
    }
  }

  /**
   * Validate update data (to be overridden by subclasses)
   * @param {Object} data - Data to validate
   */
  validateUpdateData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data provided');
    }
  }

  /**
   * Sanitize data (to be overridden by subclasses)
   * @param {Object} data - Data to sanitize
   * @returns {Object} Sanitized data
   */
  sanitizeData(data) {
    return data;
  }
}

module.exports = BaseService;
