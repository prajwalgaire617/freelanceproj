'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contracts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendorId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      freelancerId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      contractStartDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      contractEndDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      contractTerms: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'expired', 'terminated'),
        allowNull: false,
        defaultValue: 'active'
      },
      signedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      Aadhar_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_nda: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      is_msa: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      ve_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      area: {
        type: Sequelize.STRING,
        allowNull: true
      },
      adr_location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      arbitration_venue: {
        type: Sequelize.STRING,
        allowNull: true
      },
      bank_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      branch_code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      is_other: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      ck_editer_data: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      agencyId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      jobApplicationId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      workTitle: {
        type: Sequelize.STRING,
        allowNull: true
      },
      workDescription: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      deliverables: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      milestones: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      paymentSchedule: {
        type: Sequelize.ENUM('hourly', 'fixed', 'milestone'),
        allowNull: true
      },
      contractStatus: {
        type: Sequelize.ENUM('draft', 'pending', 'active', 'completed', 'cancelled', 'disputed'),
        defaultValue: 'draft'
      },
      workCompleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      completionDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      paymentReleased: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      paymentReleaseDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      disputeReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      disputeResolution: {
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
    await queryInterface.addIndex('contracts', ['clientId']);
    await queryInterface.addIndex('contracts', ['freelancerId']);
    await queryInterface.addIndex('contracts', ['organizationId']);
    await queryInterface.addIndex('contracts', ['agencyId']);
    await queryInterface.addIndex('contracts', ['contractStatus']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contracts');
  }
};
