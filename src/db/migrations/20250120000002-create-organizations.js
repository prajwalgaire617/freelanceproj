'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
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
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tradeName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      GSTIN: {
        type: Sequelize.STRING,
        allowNull: true
      },
      yearOfIncorporation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      relationshipToCompany: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contactPersonPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contactPersonEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      numberOfEmployees: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      typeOfCompany: {
        type: Sequelize.STRING,
        allowNull: true
      },
      companyDirectorEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      companyDirectorPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sector: {
        type: Sequelize.STRING,
        allowNull: true
      },
      companyWebsite: {
        type: Sequelize.STRING,
        allowNull: true
      },
      aboutCompany: {
        type: Sequelize.STRING,
        allowNull: true
      },
      annualTurnover: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      servicesToExplore: {
        type: Sequelize.STRING,
        allowNull: true
      },
      termsAndConditionsAgreement: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      futureHiringPlans: {
        type: Sequelize.STRING,
        allowNull: true
      },
      softwareUsed_sourcing: {
        type: Sequelize.STRING,
        allowNull: true
      },
      softwareUsed_accounting: {
        type: Sequelize.STRING,
        allowNull: true
      },
      softwareUsed_hiring: {
        type: Sequelize.STRING,
        allowNull: true
      },
      softwareUsed_employeeDataManagement: {
        type: Sequelize.STRING,
        allowNull: true
      },
      exploreAutomationSolutions: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hasAccountingSoftware: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      hasHRManagementSoftware: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      hasCRMSoftware: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
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
    await queryInterface.addIndex('organizations', ['userId']);
    await queryInterface.addIndex('organizations', ['companyName']);
    await queryInterface.addIndex('organizations', ['email']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organizations');
  }
};
