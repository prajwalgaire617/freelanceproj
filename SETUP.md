# WorkLab Backend API - Complete Setup Guide

A modern, scalable backend API for WorkLab (Upwork Clone) built with Node.js, Express, Sequelize, and Centrifugo for real-time messaging.

## 🏗️ Architecture Overview

### Design Patterns Implemented
- **Repository Pattern**: Abstracted data access layer
- **Service Pattern**: Business logic separation  
- **Factory Pattern**: Object creation abstraction
- **Singleton Pattern**: Service instances
- **Strategy Pattern**: Different validation strategies
- **Observer Pattern**: Event-driven architecture

### Project Structure
```
src/
├── core/                   # Core design patterns
│   ├── BaseRepository.js   # Base repository with CRUD operations
│   └── BaseService.js      # Base service with business logic
├── controllers/            # HTTP request handlers
├── services/              # Business logic layer
├── repositories/          # Data access layer
├── middleware/            # Express middleware
├── routes/               # API route definitions
├── exceptions/           # Custom error classes
├── utils/                # Utility functions
├── constants/            # Application constants
├── config/              # Configuration files
└── db/                  # Database models and migrations
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **Centrifugo** (for real-time features)
- **Git** (for version control)

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd worklab-backend

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=worklab
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Centrifugo Configuration
CENTRIFUGO_URL=ws://localhost:8000/connection/websocket
CENTRIFUGO_API_URL=http://localhost:8000/api
CENTRIFUGO_API_KEY=your_centrifugo_api_key
CENTRIFUGO_SECRET=your_centrifugo_secret

# Client Configuration
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE worklab;"

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed
```

### 4. Start Centrifugo (Real-time Messaging)
```bash
# Start Centrifugo server
npm run centrifugo

# Or start both Centrifugo and API together
npm run dev:full
```

### 5. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔧 Detailed Setup Instructions

### Database Configuration

#### MySQL Setup
1. **Install MySQL** (if not already installed):
   ```bash
   # macOS
   brew install mysql
   
   # Ubuntu/Debian
   sudo apt-get install mysql-server
   
   # Windows
   # Download from https://dev.mysql.com/downloads/mysql/
   ```

2. **Start MySQL Service**:
   ```bash
   # macOS
   brew services start mysql
   
   # Ubuntu/Debian
   sudo systemctl start mysql
   ```

3. **Create Database and User**:
   ```sql
   CREATE DATABASE worklab;
   CREATE USER 'worklab_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON worklab.* TO 'worklab_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### Database Migrations
```bash
# Run all migrations
npm run migrate

# Undo last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Reset database (undo all + migrate + seed)
npm run db:reset
```

### Centrifugo Setup (Real-time Messaging)

#### 1. Download and Install Centrifugo
```bash
# Download Centrifugo
wget https://github.com/centrifugal/centrifugo/releases/latest/download/centrifugo_linux_amd64.tar.gz

# Extract
tar -xzf centrifugo_linux_amd64.tar.gz

# Make executable
chmod +x centrifugo

# Move to project directory
mv centrifugo /Users/prajwalgaire/worklab/
```

#### 2. Configure Centrifugo
The `centrifugo.json` configuration is already provided:
```json
{
  "token_hmac_secret_key": "your-centrifugo-secret",
  "admin_password": "admin",
  "admin_secret": "admin-secret",
  "api_key": "your-centrifugo-api-key",
  "allowed_origins": ["*"],
  "websocket_compression": true,
  "websocket_compression_level": 3,
  "websocket_compression_min_size": 1024
}
```

#### 3. Start Centrifugo
```bash
# Using the provided script
./start-centrifugo.sh

# Or manually
./centrifugo --config=centrifugo.json
```

### API Documentation

#### Swagger UI
- **URL**: `http://localhost:3001/api-docs`
- **Features**: Interactive API documentation, request/response examples
- **Authentication**: JWT token support

#### Available Endpoints
- **Health Check**: `GET /health`
- **API Info**: `GET /`
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **Users**: `GET /api/users`, `POST /api/users`
- **Real-time**: `POST /api/centrifugo/send-message`

## 🧪 Testing the Setup

### 1. Health Check
```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-11T17:11:59.430Z",
  "uptime": 6.427832125,
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. API Documentation
```bash
# Open in browser
open http://localhost:3001/api-docs
```

### 3. Test User Endpoints
```bash
# Get all users
curl http://localhost:3001/api/users

# Search users
curl "http://localhost:3001/api/users/search?q=john"

# Get users by type
curl http://localhost:3001/api/users/type/freelancer
```

### 4. Test Real-time Messaging
```bash
# Generate Centrifugo token
curl -X POST http://localhost:3001/api/centrifugo/token \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "userInfo": {"name": "Test User"}}'

# Send message
curl -X POST http://localhost:3001/api/centrifugo/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "1",
    "receiverId": "2", 
    "content": "Hello World!",
    "messageType": "text"
  }'
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Different access levels (admin, client, freelancer, agency)
- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Comprehensive data validation and sanitization

### Security Headers
- **Helmet.js**: Security headers (XSS, CSRF, etc.)
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: API abuse prevention
- **SQL Injection Protection**: Sequelize ORM protection

### Environment Security
```env
# Use strong, unique secrets
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CENTRIFUGO_SECRET=your_centrifugo_secret_min_32_chars

# Restrict CORS in production
CLIENT_URL=https://yourdomain.com

# Use environment-specific database credentials
DB_PASSWORD=strong_database_password
```

## 📊 Performance Optimizations

### Database
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Optimized Sequelize queries
- **Indexing**: Proper database indexing
- **Pagination**: Efficient data pagination

### Caching (Optional)
```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Monitoring
- **Health Checks**: `/health` endpoint
- **Structured Logging**: JSON-formatted logs
- **Error Tracking**: Centralized error handling
- **Performance Metrics**: Response time tracking

## 🚀 Deployment

### Production Environment
```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Use production database
DB_HOST=your_production_db_host
DB_PASSWORD=your_production_db_password

# Use production Centrifugo
CENTRIFUGO_URL=wss://your-centrifugo-domain.com/connection/websocket
CENTRIFUGO_API_URL=https://your-centrifugo-domain.com/api

# Restrict CORS
CLIENT_URL=https://yourdomain.com
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start src/app.js --name "worklab-api"
pm2 startup
pm2 save
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

#### 2. Database Connection Issues
```bash
# Check MySQL status
brew services list | grep mysql

# Restart MySQL
brew services restart mysql

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

#### 3. Centrifugo Connection Issues
```bash
# Check Centrifugo status
curl http://localhost:8000/api

# Check Centrifugo logs
tail -f centrifugo.log

# Restart Centrifugo
pkill centrifugo
./start-centrifugo.sh
```

#### 4. Migration Issues
```bash
# Reset database completely
npm run migrate:undo:all
mysql -u root -p -e "DROP DATABASE worklab; CREATE DATABASE worklab;"
npm run migrate
```

### Logs and Debugging
```bash
# View application logs
npm run dev

# View Centrifugo logs
tail -f centrifugo.log

# Check database logs
tail -f /usr/local/var/mysql/*.log
```

## 📚 API Reference

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### User Management
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/search` - Search users
- `GET /api/users/type/:type` - Get users by type

### Real-time Messaging
- `POST /api/centrifugo/token` - Generate auth token
- `POST /api/centrifugo/send-message` - Send message
- `GET /api/centrifugo/history/:userId1/:userId2` - Get conversation history
- `GET /api/centrifugo/presence/:userId1/:userId2` - Get online status
- `POST /api/centrifugo/mark-read` - Mark message as read

### Other Endpoints
- `GET /health` - Health check
- `GET /api-docs` - API documentation
- `GET /` - API information

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this setup guide and API docs
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

### Useful Commands
```bash
# Development
npm run dev              # Start development server
npm run dev:full         # Start with Centrifugo

# Database
npm run migrate          # Run migrations
npm run migrate:undo     # Undo last migration
npm run db:reset         # Reset database

# Centrifugo
npm run centrifugo       # Start Centrifugo
npm run centrifugo:test  # Test Centrifugo connection

# Utilities
npm run clean            # Clean and reinstall dependencies
npm run docs             # View API documentation
```

---

**🎉 You're all set!** Your WorkLab backend API is now ready for development and production use.
