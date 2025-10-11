const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
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
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

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
      'GET /api/agencies'
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
app.listen(port, host, () => {
  console.log(`🚀 WorkLab API Server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://${host}:${port}/health`);
  console.log(`📚 API Documentation: http://${host}:${port}/`);
});

module.exports = app;