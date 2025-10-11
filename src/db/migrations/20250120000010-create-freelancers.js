'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('freelancers', {
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
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileImg: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true
      },
      yearsOfExperience: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expertise: {
        type: Sequelize.STRING,
        allowNull: true
      },
      interestedProducts: {
        type: Sequelize.STRING,
        allowNull: true
      },
      freelancerInterest: {
        type: Sequelize.STRING,
        allowNull: true
      },
      remoteWorkSuccessKey: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resume: {
        type: Sequelize.STRING,
        allowNull: true
      },
      shortBio: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userType: {
        type: Sequelize.ENUM('it', 'non-it'),
        allowNull: true,
        defaultValue: 'it'
      },
      localFreelance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      visibility: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'public'
      },
      hours: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      languages: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      education: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      portfolio: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      certification: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      employmentHistory: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      otherExperiences: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      introVideo: {
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
    await queryInterface.addIndex('freelancers', ['userId']);
    await queryInterface.addIndex('freelancers', ['email']);
    await queryInterface.addIndex('freelancers', ['userType']);
    await queryInterface.addIndex('freelancers', ['visibility']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('freelancers');
  }
};
