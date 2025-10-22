'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'emailVerificationOTP', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'emailVerificationOTPExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'passwordResetOTP', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'passwordResetOTPExpires', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'otpAttempts', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('Users', 'otpLastAttempt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'emailVerificationOTP');
    await queryInterface.removeColumn('Users', 'emailVerificationOTPExpires');
    await queryInterface.removeColumn('Users', 'passwordResetOTP');
    await queryInterface.removeColumn('Users', 'passwordResetOTPExpires');
    await queryInterface.removeColumn('Users', 'otpAttempts');
    await queryInterface.removeColumn('Users', 'otpLastAttempt');
  }
};

