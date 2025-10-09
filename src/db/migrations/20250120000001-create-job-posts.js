'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      monthly_amount: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      responsibilities: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      requirements: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      salary: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      posted_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_date_to_apply: {
        type: Sequelize.DATE,
        allowNull: true
      },
      job_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      job_location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      job_start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contract_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      candidate_experience: {
        type: Sequelize.STRING,
        allowNull: true
      },
      candidate_age: {
        type: Sequelize.STRING,
        allowNull: true
      },
      work_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      apply_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      budget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      budgetType: {
        type: Sequelize.ENUM('fixed', 'hourly', 'range'),
        allowNull: true
      },
      minBudget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      maxBudget: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      skills: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      experienceLevel: {
        type: Sequelize.ENUM('entry', 'intermediate', 'expert'),
        allowNull: true
      },
      projectDuration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'paused', 'closed', 'completed'),
        defaultValue: 'draft'
      },
      maxApplications: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      applicationDeadline: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      connectRequired: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isUrgent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.addIndex('job_posts', ['clientId']);
    await queryInterface.addIndex('job_posts', ['organizationId']);
    await queryInterface.addIndex('job_posts', ['status']);
    await queryInterface.addIndex('job_posts', ['isPublic']);
    await queryInterface.addIndex('job_posts', ['isFeatured']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('job_posts');
  }
};
