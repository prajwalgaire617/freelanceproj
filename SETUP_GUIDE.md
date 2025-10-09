# WorkLab API Setup Guide

Complete setup guide for the WorkLab Upwork Clone Backend API.

## 📋 **Prerequisites**

### **System Requirements**
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **MySQL**: v8.0 or higher
- **Git**: Latest version

### **macOS Setup**
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Install Git (if not already installed)
brew install git
```

### **Windows Setup**
```bash
# Install Node.js from https://nodejs.org/
# Install MySQL from https://dev.mysql.com/downloads/mysql/
# Install Git from https://git-scm.com/download/win
```

### **Linux (Ubuntu/Debian) Setup**
```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Install Git
sudo apt install git
```

## 🚀 **Quick Start**

### **1. Clone Repository**
```bash
git clone <your-repository-url>
cd worklab-platform/backend/the-work-lab-server
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### **4. Database Setup**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE worklab;"

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed
```

### **5. Start Server**
```bash
npm run dev
```

## ⚙️ **Detailed Setup**

### **Step 1: Environment Configuration**

Create a `.env` file in the project root:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=worklab
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
JWT_EXPIRE=30d

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@worklab.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Step 2: Database Setup**

#### **Create MySQL Database**
```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE worklab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional, for security)
CREATE USER 'worklab_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON worklab.* TO 'worklab_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

#### **Run Database Migrations**
```bash
# Run all migrations
npm run migrate

# Check migration status
npm run migrate:status

# Undo last migration (if needed)
npm run migrate:undo

# Undo all migrations (if needed)
npm run migrate:undo:all
```

#### **Seed Database (Optional)**
```bash
# Seed with sample data
npm run seed

# Reset database (migrate + seed)
npm run db:reset
```

### **Step 3: Verify Installation**

#### **Check Server Health**
```bash
# Start server
npm run dev

# In another terminal, test health endpoint
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

#### **Test API Endpoints**
```bash
# Test root endpoint
curl http://localhost:3000/

# Test job search
curl "http://localhost:3000/api/jobs?search=react&limit=5"

# Test Swagger documentation
open http://localhost:3000/api-docs/
```

## 🔧 **Configuration Options**

### **Database Configuration**

#### **MySQL Configuration**
```javascript
// src/db/config/config.json
{
  "development": {
    "username": "root",
    "password": "your_password",
    "database": "worklab",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql",
    "logging": false,
    "pool": {
      "max": 5,
      "min": 0,
      "acquire": 30000,
      "idle": 10000
    }
  }
}
```

#### **Connection Pool Settings**
- **max**: Maximum number of connections (default: 5)
- **min**: Minimum number of connections (default: 0)
- **acquire**: Maximum time to get connection (default: 30000ms)
- **idle**: Maximum time connection can be idle (default: 10000ms)

### **Security Configuration**

#### **JWT Settings**
```env
JWT_SECRET=your-super-secret-key-minimum-32-characters
JWT_EXPIRE=30d
```

#### **Rate Limiting**
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window
```

#### **CORS Settings**
```javascript
// Configured in src/app.js
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 🧪 **Testing Setup**

### **Run Test Suite**
```bash
# Run all tests
npm test

# Run specific test file
npm test -- --grep "Authentication"

# Run tests with coverage
npm run test:coverage
```

### **API Testing with Postman**
1. Import `WorkLab_API.postman_collection.json`
2. Set environment variables:
   - `base_url`: http://localhost:3000
   - `freelancer_token`: Your JWT token
   - `client_token`: Your JWT token
   - `agency_token`: Your JWT token

### **Manual Testing**
```bash
# Run automated test script
./test-api.sh

# Test specific endpoints
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","userType":"freelancer"}'
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### **Database Connection Issues**
```bash
# Check MySQL status
brew services list | grep mysql  # macOS
sudo systemctl status mysql      # Linux

# Start MySQL
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux

# Test connection
mysql -u root -p -e "SELECT 1;"
```

#### **Migration Issues**
```bash
# Check migration status
npm run migrate:status

# Reset database
npm run db:reset

# Check for pending migrations
npx sequelize-cli db:migrate:status
```

#### **Permission Issues**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **Environment Variable Issues**
```bash
# Check if .env file exists
ls -la .env

# Verify environment variables are loaded
node -e "console.log(process.env.NODE_ENV)"
```

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable specific debug modules
DEBUG=sequelize:* npm run dev

# Check server logs
tail -f logs/app.log
```

## 📊 **Performance Optimization**

### **Database Optimization**
```sql
-- Add indexes for better performance
CREATE INDEX idx_job_posts_status ON job_posts(status);
CREATE INDEX idx_job_posts_skills ON job_posts(skills);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_job_applications_job_id ON job_applications(jobPostId);
```

### **Server Optimization**
```javascript
// Enable compression
app.use(compression());

// Set cache headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### **Memory Management**
```bash
# Monitor memory usage
node --inspect src/app.js

# Use PM2 for production
npm install -g pm2
pm2 start src/app.js --name "worklab-api"
```

## 🚀 **Production Deployment**

### **Environment Setup**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
JWT_SECRET=your-production-jwt-secret
```

### **Security Checklist**
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring
- [ ] Enable logging
- [ ] Configure backup strategy

### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=worklab
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 📚 **Additional Resources**

### **Documentation**
- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SETUP.md)
- [Testing Guide](API_TESTING_GUIDE.md)
- [Swagger Setup](SWAGGER_SETUP.md)

### **Useful Commands**
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run migrate          # Run migrations
npm run migrate:undo     # Undo last migration
npm run seed             # Seed database
npm run db:reset         # Reset database

# Testing
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage
./test-api.sh           # Run API tests

# Utilities
npm run lint             # Run linter
npm run format           # Format code
npm run docs             # Generate documentation
```

### **Support**
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check the docs folder
- **API Reference**: http://localhost:3000/api-docs/

---

**Happy Coding! 🚀**

For more help, check the troubleshooting section or create an issue on GitHub.
