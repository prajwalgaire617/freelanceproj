const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import Swagger configuration
const swaggerSpec = require('./config/swagger');

// Import database connection
const { connectDB } = require('./db/config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
const connectRoutes = require('./routes/connectRoutes');
const contractRoutes = require('./routes/contractRoutes');
const messageRoutes = require('./routes/messageRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');
const clientRoutes = require('./routes/clientRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const websocketRoutes = require('./routes/websocketRoutes');

// Import existing routes (commented out until they exist)
// const FreelancerRoutes = require('./routes/freelancerRoutes');
// const OrganizationRoutes = require('./routes/organizationRoutes');
// const AdminRoutes = require('./routes/adminRoutes');
// const jobPost = require('./routes/jobPostRoutes');
// const JobApplcaitonApply = require('./routes/jobApplicationRoutes');
// const VendorRoutes = require('./routes/vendorRoutes');
// const OrganizationUserRoutes = require('./routes/organizationUserRoutes');
// const OrganizationRolesRoutes = require('./routes/organizationRolesRoutes');
// const userDetails = require('./routes/userDetailsRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xzoxnco02983h4b2o3soj');
    const db = require('./db');
    const user = await db.User.findByPk(decoded.id);
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user.id;
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

// Socket.IO Connection Handling
io.on('connection', (socket) => {
  console.log(`👤 User ${socket.user.firstName} ${socket.user.lastName} connected (ID: ${socket.userId})`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Handle joining conversation rooms
  socket.on('join_conversation', (data) => {
    const { partnerId } = data;
    const roomName = `conversation_${Math.min(socket.userId, partnerId)}_${Math.max(socket.userId, partnerId)}`;
    socket.join(roomName);
    console.log(`💬 User ${socket.userId} joined conversation with ${partnerId}`);
  });
  
  // Handle leaving conversation rooms
  socket.on('leave_conversation', (data) => {
    const { partnerId } = data;
    const roomName = `conversation_${Math.min(socket.userId, partnerId)}_${Math.max(socket.userId, partnerId)}`;
    socket.leave(roomName);
    console.log(`💬 User ${socket.userId} left conversation with ${partnerId}`);
  });
  
  // Handle real-time message sending
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content, messageType = 'text', attachments = [] } = data;
      
      // Save message to database
      const db = require('./db');
      const message = await db.Message.create({
        senderId: socket.userId,
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
      
      // Emit to conversation room
      const roomName = `conversation_${Math.min(socket.userId, receiverId)}_${Math.max(socket.userId, receiverId)}`;
      io.to(roomName).emit('new_message', messageWithDetails);
      
      // Emit to receiver's personal room for notifications
      io.to(`user_${receiverId}`).emit('message_notification', {
        message: messageWithDetails,
        unreadCount: await getUnreadCount(receiverId)
      });
      
      console.log(`📨 Message sent from ${socket.userId} to ${receiverId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { partnerId } = data;
    const roomName = `conversation_${Math.min(socket.userId, partnerId)}_${Math.max(socket.userId, partnerId)}`;
    socket.to(roomName).emit('user_typing', {
      userId: socket.userId,
      userName: `${socket.user.firstName} ${socket.user.lastName}`,
      isTyping: true
    });
  });
  
  socket.on('typing_stop', (data) => {
    const { partnerId } = data;
    const roomName = `conversation_${Math.min(socket.userId, partnerId)}_${Math.max(socket.userId, partnerId)}`;
    socket.to(roomName).emit('user_typing', {
      userId: socket.userId,
      userName: `${socket.user.firstName} ${socket.user.lastName}`,
      isTyping: false
    });
  });
  
  // Handle message read status
  socket.on('mark_message_read', async (data) => {
    try {
      const { messageId } = data;
      const db = require('./db');
      
      await db.Message.update(
        { isRead: true, readAt: new Date() },
        { where: { id: messageId, receiverId: socket.userId } }
      );
      
      // Notify sender that message was read
      const message = await db.Message.findByPk(messageId);
      if (message) {
        io.to(`user_${message.senderId}`).emit('message_read', {
          messageId,
          readAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`👤 User ${socket.user.firstName} ${socket.user.lastName} disconnected (ID: ${socket.userId})`);
  });
});

// Helper function to get unread message count
async function getUnreadCount(userId) {
  try {
    const db = require('./db');
    const count = await db.Message.count({
      where: { receiverId: userId, isRead: false }
    });
    return count;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Expose uploads directory for serving profile images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WorkLab API Documentation'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'WorkLab API - Upwork Clone Backend',
    version: '1.0.0',
    status: 'active',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      jobApplications: '/api/job-applications',
      connects: '/api/connects',
      contracts: '/api/contracts',
      messages: '/api/messages',
      agencies: '/api/agencies',
      freelancers: '/api/freelancer',
      organizations: '/api/organization',
      jobs: '/api/job'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/connects', connectRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/freelancer', freelancerRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/jobs', jobPostRoutes);
app.use('/api/websocket', websocketRoutes);

// Existing routes (commented out until they exist)
// app.use('/api/freelancer', FreelancerRoutes);
// app.use('/api/organization', OrganizationRoutes);
// app.use('/api/admin', AdminRoutes);
// app.use('/api/job', jobPost);
// app.use('/api/job-form', JobApplcaitonApply);
// app.use('/api/vendor', VendorRoutes);
// app.use('/api/organization/user', OrganizationUserRoutes);
// app.use('/api/role', OrganizationRolesRoutes);
// app.use('/api/userDetails', userDetails);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/job-applications',
      'GET /api/job-applications/my-applications',
      'POST /api/connects/purchase',
      'GET /api/connects',
      'POST /api/contracts',
      'GET /api/contracts',
      'POST /api/messages',
      'GET /api/messages/conversations',
      'POST /api/agencies',
      'GET /api/agencies',
      'GET /api/websocket/events',
      'GET /api/websocket/test',
      'WS /websocket'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      message: errors.join(', ')
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'A record with this information already exists'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided token is invalid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'The provided token has expired'
    });
  }

  // Stripe errors
  if (err.type && err.type.startsWith('Stripe')) {
    return res.status(400).json({
      error: 'Payment Error',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.stack
  });
});

// Start server
const host = '0.0.0.0';
server.listen(port, host, () => {
  console.log(`🚀 WorkLab API Server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://${host}:${port}/health`);
  console.log(`📚 API Documentation: http://${host}:${port}/`);
  console.log(`💬 WebSocket Server: ws://${host}:${port}`);
});

module.exports = { app, server, io };