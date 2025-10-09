'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('connects', {
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
      type: {
        type: Sequelize.ENUM('purchased', 'earned', 'bonus', 'refund'),
        allowNull: false,
        defaultValue: 'purchased'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      stripePaymentIntentId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      stripeChargeId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      used: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      remaining: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
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
    await queryInterface.addIndex('connects', ['userId']);
    await queryInterface.addIndex('connects', ['type']);
    await queryInterface.addIndex('connects', ['status']);
    await queryInterface.addIndex('connects', ['createdAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('connects');
  }
};