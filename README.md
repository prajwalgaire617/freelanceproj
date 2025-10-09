# WorkLab Backend API - Upwork Clone

A comprehensive backend API for a freelance marketplace platform similar to Upwork, built with Node.js, Express.js, and MySQL.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, email verification, OAuth (Google, Facebook, LinkedIn)
- **Job Management**: Job posting, searching, filtering, and application system
- **Connect System**: Freelancer connect purchase and usage with Stripe integration
- **Contract Management**: Work contracts with payment processing and dispute resolution
- **Messaging System**: Real-time messaging between clients and freelancers
- **Agency Management**: Agency profiles and freelancer management

### User Types
- **Freelancers**: Apply for jobs, manage contracts, receive payments
- **Clients**: Post jobs, hire freelancers, manage projects
- **Agencies**: Manage multiple freelancers, apply for jobs as a team

### Payment Integration
- **Stripe Integration**: Secure payment processing for connects and contracts
- **Payment Intents**: Modern payment flow with client-side confirmation
- **Refund Support**: Automated refund processing

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive request validation
- **Helmet.js**: Security headers and protection
- **Password Hashing**: bcryptjs for secure password storage

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT + Passport.js
- **Payment**: Stripe
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet.js, express-rate-limit
- **Real-time**: Socket.io (ready for implementation)

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd worklab-platform/backend/the-work-lab-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database Setup**
```bash
# Quick setup (creates database and runs migrations)
npm run setup-db
npm run migrate

# Or manual setup:
# mysql -u root -p
# CREATE DATABASE worklab;
# CREATE DATABASE worklab_test;
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=worklab
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:3000/api/auth/linkedin/callback

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts and authentication
- `freelancers` - Freelancer profiles
- `organizations` - Client organizations
- `agencies` - Agency profiles

### Job Management
- `job_posts` - Job postings
- `job_applications` - Job applications
- `connects` - Connect system

### Contract & Payment
- `contracts` - Work contracts
- `messages` - Messaging system

### Relationships
- `agency_freelancers` - Agency-freelancer relationships

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### OAuth
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth
- `GET /api/auth/linkedin` - LinkedIn OAuth

### Job Applications
- `POST /api/job-applications` - Apply for job
- `GET /api/job-applications/my-applications` - Get user's applications
- `GET /api/job-applications/job/:jobPostId` - Get job applications
- `PUT /api/job-applications/:applicationId/status` - Update application status

### Connects
- `POST /api/connects/purchase` - Purchase connects
- `GET /api/connects` - Get user's connects
- `POST /api/connects/create-payment-intent` - Create payment intent
- `GET /api/connects/packages` - Get connect packages

### Contracts
- `POST /api/contracts` - Create contract
- `GET /api/contracts` - Get user's contracts
- `PUT /api/contracts/:contractId/accept` - Accept contract
- `POST /api/contracts/:contractId/release-payment` - Release payment

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/conversation/:userId` - Get conversation
- `PUT /api/messages/mark-read` - Mark messages as read

### Agencies
- `POST /api/agencies` - Create agency profile
- `GET /api/agencies` - Get all agencies
- `POST /api/agencies/:agencyId/freelancers` - Add freelancer to agency
- `GET /api/agencies/:agencyId/freelancers` - Get agency freelancers

## 🗄️ Database Commands

```bash
# Create databases
npm run setup-db

# Run migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Reset database (undo all + migrate + seed)
npm run db:reset

# Seed initial data
npm run seed
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation
- **Helmet.js**: Security headers and protection
- **Password Hashing**: bcryptjs with salt rounds
- **CORS Protection**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: Sequelize ORM with parameterized queries

## 📱 API Usage Examples

### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "freelancer"
  }'
```

### Job Application
```bash
curl -X POST http://localhost:3000/api/job-applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobPostId": 1,
    "coverLetter": "I am interested in this position...",
    "proposedRate": 25.00,
    "proposedTimeline": "2 weeks"
  }'
```

### Purchase Connects
```bash
curl -X POST http://localhost:3000/api/connects/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "quantity": 10,
    "paymentMethodId": "pm_card_visa"
  }'
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring

- **Health Check**: `GET /health`
- **API Status**: `GET /`
- **Database Status**: Included in health check

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SSL certificates
4. Configure reverse proxy (nginx)
5. Set up monitoring and logging

### Docker (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the database setup guide

## 🔄 Changelog

### Version 1.0.0
- Initial release
- User authentication and OAuth
- Job application system
- Connect system with Stripe
- Contract management
- Messaging system
- Agency management
- Comprehensive API documentation

---

**WorkLab Backend API** - Building the future of freelance work! 🚀