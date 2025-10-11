const io = require('socket.io-client');

// Test tokens (replace with actual tokens from your API)
const FREELANCER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYwMTc3OTU1LCJleHAiOjE3NjI3Njk5NTV9.WKPr0EP3cGYaapFw5zRNDljLDlMYQPJgVtZJSwW8Ems';
const CLIENT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzYwMTc4MDU2LCJleHAiOjE3NjI3NzAwNTZ9.ldydVxGAYcxYGLlUhaesmKYxGcMmb8q-RRFEculidJ8';

console.log('🚀 Starting WorkLab Real-time Chat Test Client\n');

// Create freelancer client
const freelancerSocket = io('http://localhost:3001', {
  auth: {
    token: FREELANCER_TOKEN
  }
});

// Create client socket
const clientSocket = io('http://localhost:3001', {
  auth: {
    token: CLIENT_TOKEN
  }
});

// Freelancer socket events
freelancerSocket.on('connect', () => {
  console.log('✅ Freelancer connected:', freelancerSocket.id);
  
  // Join conversation with client (ID: 2)
  freelancerSocket.emit('join_conversation', { partnerId: 2 });
  
  // Send a test message after 2 seconds
  setTimeout(() => {
    console.log('📤 Freelancer sending message...');
    freelancerSocket.emit('send_message', {
      receiverId: 2,
      content: 'Hello! I am interested in your React Developer job posting. I have 5+ years of experience with React and Node.js.',
      messageType: 'text'
    });
  }, 2000);
});

freelancerSocket.on('new_message', (message) => {
  console.log('📨 Freelancer received message:', message.content);
  console.log('   From:', message.sender.firstName, message.sender.lastName);
  console.log('   Time:', new Date(message.sentAt).toLocaleString());
  console.log('');
});

freelancerSocket.on('user_typing', (data) => {
  console.log('⌨️  Freelancer sees typing:', data.userName, data.isTyping ? 'is typing...' : 'stopped typing');
});

freelancerSocket.on('message_read', (data) => {
  console.log('👁️  Freelancer sees message read:', data.messageId);
});

freelancerSocket.on('connect_error', (error) => {
  console.error('❌ Freelancer connection error:', error.message);
});

// Client socket events
clientSocket.on('connect', () => {
  console.log('✅ Client connected:', clientSocket.id);
  
  // Join conversation with freelancer (ID: 1)
  clientSocket.emit('join_conversation', { partnerId: 1 });
  
  // Respond to freelancer after 4 seconds
  setTimeout(() => {
    console.log('📤 Client sending response...');
    clientSocket.emit('send_message', {
      receiverId: 1,
      content: 'Hi John! Thank you for your interest. I would love to see your portfolio and discuss the project details. When would be a good time for a call?',
      messageType: 'text'
    });
  }, 4000);
  
  // Simulate typing after 6 seconds
  setTimeout(() => {
    console.log('⌨️  Client starts typing...');
    clientSocket.emit('typing_start', { partnerId: 1 });
    
    setTimeout(() => {
      console.log('⌨️  Client stops typing...');
      clientSocket.emit('typing_stop', { partnerId: 1 });
    }, 2000);
  }, 6000);
});

clientSocket.on('new_message', (message) => {
  console.log('📨 Client received message:', message.content);
  console.log('   From:', message.sender.firstName, message.sender.lastName);
  console.log('   Time:', new Date(message.sentAt).toLocaleString());
  console.log('');
});

clientSocket.on('user_typing', (data) => {
  console.log('⌨️  Client sees typing:', data.userName, data.isTyping ? 'is typing...' : 'stopped typing');
});

clientSocket.on('message_notification', (data) => {
  console.log('🔔 Client received notification:', data.message.content);
  console.log('   Unread count:', data.unreadCount);
  console.log('');
});

clientSocket.on('connect_error', (error) => {
  console.error('❌ Client connection error:', error.message);
});

// Handle disconnections
freelancerSocket.on('disconnect', () => {
  console.log('👋 Freelancer disconnected');
});

clientSocket.on('disconnect', () => {
  console.log('👋 Client disconnected');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test client...');
  freelancerSocket.disconnect();
  clientSocket.disconnect();
  process.exit(0);
});

console.log('💬 Chat test client running. Press Ctrl+C to exit.\n');
