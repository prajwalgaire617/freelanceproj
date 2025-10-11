const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/websocket/events:
 *   get:
 *     tags: [WebSocket]
 *     summary: Get WebSocket Events Documentation
 *     description: Returns comprehensive documentation of all WebSocket events and usage examples
 *     responses:
 *       200:
 *         description: WebSocket events documentation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "WebSocket events documentation"
 *                 events:
 *                   type: object
 *                   properties:
 *                     clientToServer:
 *                       type: array
 *                       items:
 *                         type: object
 *                       example: [
 *                         {
 *                           "event": "join_conversation",
 *                           "description": "Join a conversation room with another user",
 *                           "data": { "partnerId": 2 }
 *                         },
 *                         {
 *                           "event": "send_message",
 *                           "description": "Send a real-time message",
 *                           "data": { "receiverId": 2, "content": "Hello!", "messageType": "text" }
 *                         }
 *                       ]
 *                     serverToClient:
 *                       type: array
 *                       items:
 *                         type: object
 *                       example: [
 *                         {
 *                           "event": "new_message",
 *                           "description": "Receive a new message in real-time",
 *                           "data": { "id": 123, "content": "Hello!", "sender": {...} }
 *                         },
 *                         {
 *                           "event": "user_typing",
 *                           "description": "Receive typing indicator",
 *                           "data": { "userId": 1, "userName": "John Doe", "isTyping": true }
 *                         }
 *                       ]
 */
router.get('/events', (req, res) => {
  res.json({
    success: true,
    message: 'WebSocket events documentation',
    events: {
      clientToServer: [
        {
          event: 'join_conversation',
          description: 'Join a conversation room with another user',
          data: { partnerId: 2 },
          example: 'socket.emit("join_conversation", { partnerId: 2 });'
        },
        {
          event: 'leave_conversation',
          description: 'Leave a conversation room',
          data: { partnerId: 2 },
          example: 'socket.emit("leave_conversation", { partnerId: 2 });'
        },
        {
          event: 'send_message',
          description: 'Send a real-time message to another user',
          data: { 
            receiverId: 2, 
            content: 'Hello! I am interested in your project.',
            messageType: 'text',
            attachments: []
          },
          example: 'socket.emit("send_message", { receiverId: 2, content: "Hello!", messageType: "text" });'
        },
        {
          event: 'typing_start',
          description: 'Indicate that the user is typing a message',
          data: { partnerId: 2 },
          example: 'socket.emit("typing_start", { partnerId: 2 });'
        },
        {
          event: 'typing_stop',
          description: 'Indicate that the user has stopped typing',
          data: { partnerId: 2 },
          example: 'socket.emit("typing_stop", { partnerId: 2 });'
        },
        {
          event: 'mark_message_read',
          description: 'Mark a specific message as read',
          data: { messageId: 123 },
          example: 'socket.emit("mark_message_read", { messageId: 123 });'
        }
      ],
      serverToClient: [
        {
          event: 'new_message',
          description: 'Receive a new message in real-time',
          data: {
            id: 123,
            uuid: 'abc-123-def',
            senderId: 1,
            receiverId: 2,
            content: 'Hello! I am interested in your project.',
            messageType: 'text',
            attachments: [],
            isRead: false,
            sentAt: '2025-01-11T10:30:00.000Z',
            sender: {
              id: 1,
              firstName: 'John',
              lastName: 'Doe',
              profileImage: null,
              userType: 'freelancer'
            },
            receiver: {
              id: 2,
              firstName: 'Jane',
              lastName: 'Smith',
              profileImage: null,
              userType: 'client'
            }
          },
          example: 'socket.on("new_message", (message) => { console.log(message.content); });'
        },
        {
          event: 'message_notification',
          description: 'Receive a notification about a new message (for unread count)',
          data: {
            message: { /* same as new_message */ },
            unreadCount: 5
          },
          example: 'socket.on("message_notification", (data) => { console.log(data.unreadCount); });'
        },
        {
          event: 'user_typing',
          description: 'Receive typing indicator from another user',
          data: {
            userId: 1,
            userName: 'John Doe',
            isTyping: true
          },
          example: 'socket.on("user_typing", (data) => { console.log(data.userName + " is typing..."); });'
        },
        {
          event: 'message_read',
          description: 'Receive notification when a message is read by the recipient',
          data: {
            messageId: 123,
            readAt: '2025-01-11T10:35:00.000Z'
          },
          example: 'socket.on("message_read", (data) => { console.log("Message read:", data.messageId); });'
        },
        {
          event: 'message_error',
          description: 'Receive error notification when message sending fails',
          data: {
            error: 'Failed to send message'
          },
          example: 'socket.on("message_error", (error) => { console.error(error.error); });'
        }
      ]
    },
    connection: {
      url: 'ws://localhost:3001',
      authentication: {
        method: 'JWT Token',
        description: 'Pass JWT token in auth object or Authorization header'
      },
      example: {
        javascript: "const socket = io('ws://localhost:3001', { auth: { token: 'your-jwt-token' } });",
        react: "import io from 'socket.io-client'; const socket = io('ws://localhost:3001', { auth: { token: token } });",
        nodejs: "const io = require('socket.io-client'); const socket = io('ws://localhost:3001', { auth: { token: token } });"
      }
    },
    testClients: [
      {
        name: 'Web Test Interface',
        description: 'Interactive web-based test interface with dual user simulation',
        file: 'test-chat.html',
        usage: 'Open in browser and test real-time messaging'
      },
      {
        name: 'Node.js Test Client',
        description: 'Automated test script that simulates two users chatting',
        file: 'chat-test-client.js',
        usage: 'node chat-test-client.js'
      },
      {
        name: 'Production Example',
        description: 'Production-ready chat client example for frontend integration',
        file: 'chat-client-example.html',
        usage: 'Use as reference for implementing in your frontend'
      }
    ]
  });
});

/**
 * @swagger
 * /api/websocket/test:
 *   get:
 *     tags: [WebSocket]
 *     summary: Test WebSocket Connection Status
 *     description: Check if WebSocket server is running and get connection information
 *     responses:
 *       200:
 *         description: WebSocket server status and test information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 status:
 *                   type: string
 *                   example: "WebSocket server is running"
 *                 url:
 *                   type: string
 *                   example: "ws://localhost:3001"
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Real-time messaging", "Typing indicators", "Message notifications", "Read receipts"]
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    status: 'WebSocket server is running',
    url: 'ws://localhost:3001',
    features: [
      'Real-time messaging',
      'Typing indicators', 
      'Message notifications',
      'Read receipts',
      'Message persistence',
      'User authentication',
      'Room management',
      'Error handling'
    ],
    testInstructions: {
      step1: 'Open test-chat.html in your browser',
      step2: 'Click "Connect Both Users" button',
      step3: 'Send messages between the two simulated users',
      step4: 'Observe real-time message delivery and typing indicators',
      step5: 'Check server logs for WebSocket events'
    },
    sampleCode: {
      connection: "const socket = io('ws://localhost:3001', { auth: { token: 'your-jwt-token' } });",
      sendMessage: "socket.emit('send_message', { receiverId: 2, content: 'Hello!', messageType: 'text' });",
      listenForMessages: "socket.on('new_message', (message) => { console.log(message.content); });",
      joinConversation: "socket.emit('join_conversation', { partnerId: 2 });"
    }
  });
});

module.exports = router;
