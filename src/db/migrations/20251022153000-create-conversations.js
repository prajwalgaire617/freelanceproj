'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      participant1Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      participant2Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      lastMessageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      lastMessageAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      unreadCount1: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Unread count for participant1'
      },
      unreadCount2: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Unread count for participant2'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint to ensure only one conversation between two users
    await queryInterface.addIndex('conversations', {
      fields: ['participant1Id', 'participant2Id'],
      unique: true,
      name: 'unique_conversation_participants'
    });

    // Add index for faster queries
    await queryInterface.addIndex('conversations', {
      fields: ['participant1Id'],
      name: 'idx_conversations_participant1'
    });

    await queryInterface.addIndex('conversations', {
      fields: ['participant2Id'],
      name: 'idx_conversations_participant2'
    });

    await queryInterface.addIndex('conversations', {
      fields: ['lastMessageAt'],
      name: 'idx_conversations_last_message'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversations');
  }
};
