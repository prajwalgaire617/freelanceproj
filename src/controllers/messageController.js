const asyncHandler = require('express-async-handler');
const db = require('../db/models/index.js');
const { validationResult } = require('express-validator');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    receiverId,
    content,
    messageType = 'text',
    attachments = [],
    contractId,
    jobApplicationId
  } = req.body;

  const senderId = req.userId;

  // Check if receiver exists
  const receiver = await db.User.findByPk(receiverId);
  if (!receiver) {
    return res.status(404).json({ error: 'Receiver not found' });
  }

  // Check if user is authorized to send message
  if (contractId) {
    const contract = await db.Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    if (contract.clientId !== senderId && contract.freelancerId !== senderId) {
      return res.status(403).json({ error: 'Not authorized to send message for this contract' });
    }
  }

  if (jobApplicationId) {
    const jobApplication = await db.JobApplication.findByPk(jobApplicationId);
    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }
    if (jobApplication.userId !== senderId && jobApplication.jobPost.clientId !== senderId) {
      return res.status(403).json({ error: 'Not authorized to send message for this application' });
    }
  }

  // Create message
  const message = await db.Message.create({
    senderId,
    receiverId,
    content,
    messageType,
    attachments,
    contractId,
    jobApplicationId,
    sentAt: new Date()
  });

  // Get message with sender details
  const messageWithDetails = await db.Message.findByPk(message.id, {
    include: [
      { model: db.User, as: 'sender' },
      { model: db.User, as: 'receiver' }
    ]
  });

  res.status(201).json({
    message: 'Message sent successfully',
    data: messageWithDetails
  });
});

// @desc    Get messages for a conversation
// @route   GET /api/messages/conversation/:userId
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const { userId: otherUserId } = req.params;
  const { page = 1, limit = 50, contractId, jobApplicationId } = req.query;
  const currentUserId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Check if other user exists
  const otherUser = await db.User.findByPk(otherUserId);
  if (!otherUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  let whereClause = {
    [db.Sequelize.Op.or]: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId }
    ]
  };

  if (contractId) {
    whereClause.contractId = contractId;
  }

  if (jobApplicationId) {
    whereClause.jobApplicationId = jobApplicationId;
  }

  const messages = await db.Message.findAndCountAll({
    where: whereClause,
    include: [
      { model: db.User, as: 'sender' },
      { model: db.User, as: 'receiver' }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['sentAt', 'ASC']]
  });

  // Mark messages as read
  await db.Message.update(
    { isRead: true, readAt: new Date() },
    {
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false
      }
    }
  );

  res.json({
    messages: messages.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(messages.count / parseInt(limit)),
      totalMessages: messages.count,
      messagesPerPage: parseInt(limit)
    }
  });
});

// @desc    Get messages for a contract
// @route   GET /api/messages/contract/:contractId
// @access  Private
const getContractMessages = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Check if contract exists and user is authorized
  const contract = await db.Contract.findByPk(contractId);
  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  if (contract.clientId !== userId && contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to view messages for this contract' });
  }

  const messages = await db.Message.findAndCountAll({
    where: { contractId },
    include: [
      { model: db.User, as: 'sender' },
      { model: db.User, as: 'receiver' }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['sentAt', 'ASC']]
  });

  res.json({
    messages: messages.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(messages.count / parseInt(limit)),
      totalMessages: messages.count,
      messagesPerPage: parseInt(limit)
    }
  });
});

// @desc    Get messages for a job application
// @route   GET /api/messages/job-application/:jobApplicationId
// @access  Private
const getJobApplicationMessages = asyncHandler(async (req, res) => {
  const { jobApplicationId } = req.params;
  const { page = 1, limit = 50 } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Check if job application exists and user is authorized
  const jobApplication = await db.JobApplication.findByPk(jobApplicationId, {
    include: [{ model: db.JobPost, as: 'jobPost' }]
  });

  if (!jobApplication) {
    return res.status(404).json({ error: 'Job application not found' });
  }

  if (jobApplication.userId !== userId && jobApplication.jobPost.clientId !== userId) {
    return res.status(403).json({ error: 'Not authorized to view messages for this application' });
  }

  const messages = await db.Message.findAndCountAll({
    where: { jobApplicationId },
    include: [
      { model: db.User, as: 'sender' },
      { model: db.User, as: 'receiver' }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['sentAt', 'ASC']]
  });

  res.json({
    messages: messages.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(messages.count / parseInt(limit)),
      totalMessages: messages.count,
      messagesPerPage: parseInt(limit)
    }
  });
});

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Get unique conversation partners
  const conversations = await db.Message.findAll({
    where: {
      [db.Sequelize.Op.or]: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    include: [
      { model: db.User, as: 'sender' },
      { model: db.User, as: 'receiver' }
    ],
    order: [['sentAt', 'DESC']]
  });

  // Group by conversation partner
  const conversationMap = new Map();
  conversations.forEach(message => {
    const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
    const partner = message.senderId === userId ? message.receiver : message.sender;
    
    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        partnerId,
        partner,
        lastMessage: message,
        unreadCount: 0
      });
    }
  });

  // Count unread messages
  for (let [partnerId, conversation] of conversationMap) {
    const unreadCount = await db.Message.count({
      where: {
        senderId: partnerId,
        receiverId: userId,
        isRead: false
      }
    });
    conversation.unreadCount = unreadCount;
  }

  const conversationList = Array.from(conversationMap.values())
    .sort((a, b) => new Date(b.lastMessage.sentAt) - new Date(a.lastMessage.sentAt))
    .slice(offset, offset + parseInt(limit));

  res.json({
    conversations: conversationList,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(conversationMap.size / parseInt(limit)),
      totalConversations: conversationMap.size,
      conversationsPerPage: parseInt(limit)
    }
  });
});

// @desc    Mark messages as read
// @route   PUT /api/messages/mark-read
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { messageIds, senderId } = req.body;
  const userId = req.userId;

  let whereClause = {
    receiverId: userId,
    isRead: false
  };

  if (messageIds && messageIds.length > 0) {
    whereClause.id = { [db.Sequelize.Op.in]: messageIds };
  }

  if (senderId) {
    whereClause.senderId = senderId;
  }

  await db.Message.update(
    { isRead: true, readAt: new Date() },
    { where: whereClause }
  );

  res.json({ message: 'Messages marked as read successfully' });
});

// @desc    Delete message
// @route   DELETE /api/messages/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.userId;

  const message = await db.Message.findByPk(messageId);

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  // Check if user is the sender
  if (message.senderId !== userId) {
    return res.status(403).json({ error: 'Not authorized to delete this message' });
  }

  await message.destroy();

  res.json({ message: 'Message deleted successfully' });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const unreadCount = await db.Message.count({
    where: {
      receiverId: userId,
      isRead: false
    }
  });

  res.json({ unreadCount });
});

module.exports = {
  sendMessage,
  getConversation,
  getContractMessages,
  getJobApplicationMessages,
  getConversations,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount,
};