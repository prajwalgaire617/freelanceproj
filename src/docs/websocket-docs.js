/**
 * @swagger
 * tags:
 *   - name: WebSocket
 *     description: Real-time chat functionality using WebSocket connections
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WebSocketConnection:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           example: "ws://localhost:3001"
 *           description: "WebSocket server URL"
 *         authentication:
 *           type: object
 *           properties:
 *             method:
 *               type: string
 *               example: "JWT Token"
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               description: "JWT token passed in auth object or Authorization header"
 *         events:
 *           type: object
 *           properties:
 *             clientToServer:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["join_conversation", "leave_conversation", "send_message", "typing_start", "typing_stop", "mark_message_read"]
 *             serverToClient:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["new_message", "message_notification", "user_typing", "message_read", "message_error"]
 */

/**
 * @swagger
 * /websocket/events:
 *   get:
 *     tags: [WebSocket]
 *     summary: WebSocket Events Documentation
 *     description: |
 *       Complete documentation of all WebSocket events for real-time chat functionality.
 *       
 *       ## Connection
 *       Connect to WebSocket using Socket.IO client:
 *       ```javascript
 *       const socket = io('ws://localhost:3001', {
 *         auth: { token: 'your-jwt-token' }
 *       });
 *       ```
 *       
 *       ## Client to Server Events
 *       
 *       ### join_conversation
 *       Join a conversation room with another user.
 *       
 *       **Event:** `join_conversation`
 *       **Data:**
 *       ```json
 *       {
 *         "partnerId": 2
 *       }
 *       ```
 *       
 *       ### leave_conversation
 *       Leave a conversation room.
 *       
 *       **Event:** `leave_conversation`
 *       **Data:**
 *       ```json
 *       {
 *         "partnerId": 2
 *       }
 *       ```
 *       
 *       ### send_message
 *       Send a real-time message to another user.
 *       
 *       **Event:** `send_message`
 *       **Data:**
 *       ```json
 *       {
 *         "receiverId": 2,
 *         "content": "Hello! I am interested in your project.",
 *         "messageType": "text",
 *         "attachments": []
 *       }
 *       ```
 *       
 *       ### typing_start
 *       Indicate that the user is typing a message.
 *       
 *       **Event:** `typing_start`
 *       **Data:**
 *       ```json
 *       {
 *         "partnerId": 2
 *       }
 *       ```
 *       
 *       ### typing_stop
 *       Indicate that the user has stopped typing.
 *       
 *       **Event:** `typing_stop`
 *       **Data:**
 *       ```json
 *       {
 *         "partnerId": 2
 *       }
 *       ```
 *       
 *       ### mark_message_read
 *       Mark a specific message as read.
 *       
 *       **Event:** `mark_message_read`
 *       **Data:**
 *       ```json
 *       {
 *         "messageId": 123
 *       }
 *       ```
 *       
 *       ## Server to Client Events
 *       
 *       ### new_message
 *       Receive a new message in real-time.
 *       
 *       **Event:** `new_message`
 *       **Data:**
 *       ```json
 *       {
 *         "id": 123,
 *         "uuid": "abc-123-def",
 *         "senderId": 1,
 *         "receiverId": 2,
 *         "content": "Hello! I am interested in your project.",
 *         "messageType": "text",
 *         "attachments": [],
 *         "isRead": false,
 *         "sentAt": "2025-01-11T10:30:00.000Z",
 *         "sender": {
 *           "id": 1,
 *           "firstName": "John",
 *           "lastName": "Doe",
 *           "profileImage": null,
 *           "userType": "freelancer"
 *         },
 *         "receiver": {
 *           "id": 2,
 *           "firstName": "Jane",
 *           "lastName": "Smith",
 *           "profileImage": null,
 *           "userType": "client"
 *         }
 *       }
 *       ```
 *       
 *       ### message_notification
 *       Receive a notification about a new message (for unread count).
 *       
 *       **Event:** `message_notification`
 *       **Data:**
 *       ```json
 *       {
 *         "message": { /* same as new_message */ },
 *         "unreadCount": 5
 *       }
 *       ```
 *       
 *       ### user_typing
 *       Receive typing indicator from another user.
 *       
 *       **Event:** `user_typing`
 *       **Data:**
 *       ```json
 *       {
 *         "userId": 1,
 *         "userName": "John Doe",
 *         "isTyping": true
 *       }
 *       ```
 *       
 *       ### message_read
 *       Receive notification when a message is read by the recipient.
 *       
 *       **Event:** `message_read`
 *       **Data:**
 *       ```json
 *       {
 *         "messageId": 123,
 *         "readAt": "2025-01-11T10:35:00.000Z"
 *       }
 *       ```
 *       
 *       ### message_error
 *       Receive error notification when message sending fails.
 *       
 *       **Event:** `message_error`
 *       **Data:**
 *       ```json
 *       {
 *         "error": "Failed to send message"
 *       }
 *       ```
 *       
 *       ## Example Implementation
 *       
 *       ### JavaScript/Node.js Client
 *       ```javascript
 *       const io = require('socket.io-client');
 *       
 *       const socket = io('ws://localhost:3001', {
 *         auth: { token: 'your-jwt-token' }
 *       });
 *       
 *       socket.on('connect', () => {
 *         console.log('Connected to chat server');
 *         // Join conversation with user ID 2
 *         socket.emit('join_conversation', { partnerId: 2 });
 *       });
 *       
 *       socket.on('new_message', (message) => {
 *         console.log('New message:', message.content);
 *         // Display message in UI
 *       });
 *       
 *       socket.on('user_typing', (data) => {
 *         console.log(`${data.userName} is typing...`);
 *         // Show typing indicator
 *       });
 *       
 *       // Send a message
 *       socket.emit('send_message', {
 *         receiverId: 2,
 *         content: 'Hello!',
 *         messageType: 'text'
 *       });
 *       ```
 *       
 *       ### React Client
 *       ```jsx
 *       import { useEffect, useState } from 'react';
 *       import io from 'socket.io-client';
 *       
 *       function ChatComponent() {
 *         const [socket, setSocket] = useState(null);
 *         const [messages, setMessages] = useState([]);
 *         
 *         useEffect(() => {
 *           const newSocket = io('ws://localhost:3001', {
 *             auth: { token: localStorage.getItem('token') }
 *           });
 *           
 *           newSocket.on('connect', () => {
 *             console.log('Connected');
 *           });
 *           
 *           newSocket.on('new_message', (message) => {
 *             setMessages(prev => [...prev, message]);
 *           });
 *           
 *           setSocket(newSocket);
 *           
 *           return () => newSocket.close();
 *         }, []);
 *         
 *         const sendMessage = (content) => {
 *           socket.emit('send_message', {
 *             receiverId: 2,
 *             content,
 *             messageType: 'text'
 *           });
 *         };
 *         
 *         return (
 *           <div>
 *             {/* Chat UI */}
 *           </div>
 *         );
 *       }
 *       ```
 *       
 *       ## Error Handling
 *       
 *       ### Connection Errors
 *       ```javascript
 *       socket.on('connect_error', (error) => {
 *         console.error('Connection failed:', error.message);
 *         // Handle authentication errors, network issues, etc.
 *       });
 *       ```
 *       
 *       ### Message Errors
 *       ```javascript
 *       socket.on('message_error', (error) => {
 *         console.error('Message failed:', error.error);
 *         // Show error to user
 *       });
 *       ```
 *       
 *       ## Room Management
 *       
 *       The WebSocket server automatically manages conversation rooms:
 *       - Room names are generated as: `conversation_{minUserId}_{maxUserId}`
 *       - Users are automatically joined to their personal room: `user_{userId}`
 *       - Messages are broadcast to the appropriate conversation room
 *       - Notifications are sent to the receiver's personal room
 *       
 *       ## Security
 *       
 *       - All WebSocket connections require JWT authentication
 *       - Users can only access their own conversations
 *       - Message validation is performed on the server
 *       - Rate limiting can be applied to prevent spam
 *       
 *       ## Testing
 *       
 *       Use the provided test clients:
 *       - `test-chat.html` - Web-based test interface
 *       - `chat-test-client.js` - Node.js automated test
 *       - `chat-client-example.html` - Production-ready example
 *     
 *     responses:
 *       200:
 *         description: WebSocket events documentation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "WebSocket events documentation"
 *                 events:
 *                   type: object
 *                   properties:
 *                     clientToServer:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["join_conversation", "send_message", "typing_start"]
 *                     serverToClient:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["new_message", "user_typing", "message_notification"]
 */

/**
 * @swagger
 * /websocket/test:
 *   get:
 *     tags: [WebSocket]
 *     summary: Test WebSocket Connection
 *     description: |
 *       Test endpoint to verify WebSocket functionality. This endpoint provides:
 *       - Connection status
 *       - Available test clients
 *       - Sample code snippets
 *       - Testing instructions
 *     
 *     responses:
 *       200:
 *         description: WebSocket test information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "WebSocket server is running"
 *                 url:
 *                   type: string
 *                   example: "ws://localhost:3001"
 *                 testClients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       file:
 *                         type: string
 *                   example: [
 *                     {
 *                       "name": "Web Test Interface",
 *                       "description": "Interactive web-based test interface",
 *                       "file": "test-chat.html"
 *                     },
 *                     {
 *                       "name": "Node.js Test Client",
 *                       "description": "Automated test script",
 *                       "file": "chat-test-client.js"
 *                     }
 *                   ]
 *                 sampleCode:
 *                   type: object
 *                   properties:
 *                     javascript:
 *                       type: string
 *                       example: "const socket = io('ws://localhost:3001', { auth: { token: 'your-token' } });"
 *                     react:
 *                       type: string
 *                       example: "import io from 'socket.io-client';"
 */
