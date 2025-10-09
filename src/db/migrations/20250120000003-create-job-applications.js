'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_applications', {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      jobPostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'job_posts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      coverLetter: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      proposedRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      proposedTimeline: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted', 'withdrawn'),
        defaultValue: 'pending'
      },
      additionalInfo: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      attachments: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      clientFeedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      clientRating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5
        }
      },
      appliedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      reviewedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      respondedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('job_applications', ['userId']);
    await queryInterface.addIndex('job_applications', ['jobPostId']);
    await queryInterface.addIndex('job_applications', ['status']);
    await queryInterface.addIndex('job_applications', ['appliedAt']);
    
    // Add unique constraint
    await queryInterface.addIndex('job_applications', ['userId', 'jobPostId'], {
      unique: true,
      name: 'unique_user_job_application'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('job_applications');
  }
};