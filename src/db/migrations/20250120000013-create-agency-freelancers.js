'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agency_freelancers', {
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
      agencyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agencies',
          key: 'id'
        }
      },
      freelancerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'freelancers',
          key: 'id'
        }
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true
      },
      commissionRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'inactive', 'terminated'),
        defaultValue: 'pending'
      },
      contractStartDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      contractEndDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      canApplyJobs: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      canManageProjects: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.addIndex('agency_freelancers', ['agencyId']);
    await queryInterface.addIndex('agency_freelancers', ['freelancerId']);
    await queryInterface.addIndex('agency_freelancers', ['status']);
    
    // Add unique constraint
    await queryInterface.addIndex('agency_freelancers', ['agencyId', 'freelancerId'], {
      unique: true,
      name: 'unique_agency_freelancer'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agency_freelancers');
  }
};
