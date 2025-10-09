'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.UUIDV4
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      agencyName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      businessType: {
        type: Sequelize.ENUM('sole_proprietorship', 'partnership', 'corporation', 'llc', 'other'),
        allowNull: true
      },
      taxId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      specializations: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      teamSize: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      yearsInBusiness: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      verificationDocuments: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      totalProjects: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      successRate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0
      },
      averageRating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('agencies', ['userId']);
    await queryInterface.addIndex('agencies', ['agencyName']);
    await queryInterface.addIndex('agencies', ['isActive']);
    await queryInterface.addIndex('agencies', ['isVerified']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agencies');
  }
};
