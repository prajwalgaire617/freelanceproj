const { sequelize } = require('./config/database');
const db = require('./models');

// Export sequelize instance and all models
module.exports = {
  sequelize,
  ...db
};
