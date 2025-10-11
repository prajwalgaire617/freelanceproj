/**
 * Centrifugo Routes
 * Handles real-time messaging via Centrifugo
 */
const express = require('express');
const CentrifugoService = require('../services/centrifugoService');
const { sendSuccess, sendError } = require('../utils/response');
const { asyncHandler } = require('../utils/asyncHandler');
const { ValidationError } = require('../exceptions/AppError');

const router = express.Router();

/**
 * Generate Centrifugo token for client authentication
 */
router.post('/token', asyncHandler(async (req, res) => {
  const { userId, userInfo = {} } = req.body;
  
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const token = CentrifugoService.generateToken(userId, userInfo);
  
  sendSuccess(res, {
    token,
    centrifugoUrl: CentrifugoService.centrifugoUrl
  }, 'Token generated successfully');
}));

/**
 * Send message via Centrifugo
 */
router.post('/send-message', asyncHandler(async (req, res) => {
  const { senderId, receiverId, content, messageType = 'text', attachments = [] } = req.body;
  
  if (!senderId || !receiverId || !content) {
    throw new ValidationError('Sender ID, receiver ID, and content are required');
  }

  // Save message to database
  const db = require('../db');
  const message = await db.Message.create({
    senderId,
    receiverId,
    content,
    messageType,
    attachments,
    isRead: false
  });
  
  // Get message with sender and receiver details
  const messageWithDetails = await db.Message.findByPk(message.id, {
    include: [
      { model: db.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'profileImage', 'userType'] },
      { model: db.User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'profileImage', 'userType'] }
    ]
  });
  
  // Publish to conversation channel
  const conversationChannel = CentrifugoService.getConversationChannel(senderId, receiverId);
  const userChannel = CentrifugoService.getUserChannel(receiverId);
  
  await CentrifugoService.publishMessage(conversationChannel, {
    type: 'new_message',
    data: messageWithDetails
  });
  
  // Send notification to receiver
  await CentrifugoService.publishMessage(userChannel, {
    type: 'message_notification',
    data: {
      message: messageWithDetails,
      unreadCount: await getUnreadCount(receiverId)
    }
  });
  
  console.log(`📨 Message sent from ${senderId} to ${receiverId} via Centrifugo`);
  
  sendSuccess(res, messageWithDetails, 'Message sent successfully');
}));

/**
 * Get conversation history
 */
router.get('/history/:userId1/:userId2', asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.params;
  const conversationChannel = CentrifugoService.getConversationChannel(userId1, userId2);
  
  const history = await CentrifugoService.getHistory(conversationChannel);
  
  sendSuccess(res, history, 'History retrieved successfully');
}));

/**
 * Get channel presence (online users)
 */
router.get('/presence/:userId1/:userId2', asyncHandler(async (req, res) => {
  const { userId1, userId2 } = req.params;
  const conversationChannel = CentrifugoService.getConversationChannel(userId1, userId2);
  
  const presence = await CentrifugoService.getPresence(conversationChannel);
  
  sendSuccess(res, presence, 'Presence retrieved successfully');
}));

/**
 * Mark message as read
 */
router.post('/mark-read', asyncHandler(async (req, res) => {
  const { messageId, userId } = req.body;
  
  if (!messageId || !userId) {
    throw new ValidationError('Message ID and user ID are required');
  }

  const db = require('../db');
  
  // Update message in database
  const [updatedRows] = await db.Message.update(
    { isRead: true, readAt: new Date() },
    { where: { id: messageId, receiverId: userId } }
  );
  
  if (updatedRows === 0) {
    throw new ValidationError('Message not found or already read');
  }
  
  // Get message details
  const message = await db.Message.findByPk(messageId);
  if (message) {
    // Notify sender that message was read
    const senderChannel = CentrifugoService.getUserChannel(message.senderId);
    await CentrifugoService.publishMessage(senderChannel, {
      type: 'message_read',
      data: {
        messageId,
        readAt: new Date()
      }
    });
  }
  
  sendSuccess(res, null, 'Message marked as read');
}));

/**
 * Helper function to get unread message count
 */
async function getUnreadCount(userId) {
  try {
    const db = require('../db');
    const count = await db.Message.count({
      where: { receiverId: userId, isRead: false }
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

module.exports = router;
