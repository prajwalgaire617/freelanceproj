# WorkLab API Testing Guide

Comprehensive testing guide for the WorkLab Upwork Clone Backend API.

## 🚀 **Quick Start**

### **1. Start the Server**
```bash
cd /Users/prajwalgaire/worklab/worklab-platform/backend/the-work-lab-server
npm run dev
```

### **2. Access Documentation**
- **Swagger UI**: http://localhost:3000/api-docs
- **API Root**: http://localhost:3000/
- **Health Check**: http://localhost:3000/health

## 🔧 **Environment Setup**

### **Required Environment Variables**
Create a `.env` file in the project root:
```env
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=worklab
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🧪 **API Testing Workflows**

### **Workflow 1: Complete Freelancer Journey**

#### **Step 1: Register as Freelancer**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "freelancer@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Freelancer",
    "userType": "freelancer"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "uuid": "b57edd34-94bd-44fb-a47e-ade925953ebc",
    "email": "freelancer@example.com",
    "firstName": "John",
    "lastName": "Freelancer",
    "userType": "freelancer",
    "isEmailVerified": false
  }
}
```

#### **Step 2: Login as Freelancer**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "freelancer@example.com",
    "password": "password123"
  }'
```

#### **Step 3: Search Jobs**
```bash
curl -X GET "http://localhost:3000/api/freelancer/jobs/search?searchTerm=react&skills=javascript&budgetMin=500&budgetMax=5000&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Step 4: Get Job Details**
```bash
curl -X GET "http://localhost:3000/api/freelancer/jobs/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Step 5: Apply to Job (with Connect Deduction)**
```bash
curl -X POST http://localhost:3000/api/job-applications/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobPostId": 1,
    "coverLetter": "I am very interested in this React project. I have 5 years of experience...",
    "proposedRate": 25.00,
    "proposedTimeline": "2 weeks"
  }'
```

#### **Step 6: Check Connect Balance**
```bash
curl -X GET "http://localhost:3000/api/freelancer/connects" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Step 7: View My Applications**
```bash
curl -X GET "http://localhost:3000/api/freelancer/applications?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Workflow 2: Complete Client Journey**

#### **Step 1: Register as Client**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Client",
    "userType": "client"
  }'
```

#### **Step 2: Search Freelancers**
```bash
curl -X GET "http://localhost:3000/api/client/freelancers/search?searchTerm=react&skills=javascript&hourlyRateMin=20&hourlyRateMax=100&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN"
```

#### **Step 3: Create Job Post**
```bash
curl -X POST http://localhost:3000/api/client/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN" \
  -d '{
    "title": "Build a React E-commerce Website",
    "description": "I need a professional e-commerce website built with React, Node.js, and MongoDB. The site should include user authentication, product catalog, shopping cart, and payment integration.",
    "budget": 2500,
    "budgetType": "fixed",
    "skills": ["react", "javascript", "node.js", "mongodb", "stripe"],
    "experienceLevel": "expert",
    "projectDuration": "4-6 weeks",
    "timezone": "EST",
    "connectRequired": 3,
    "isUrgent": false,
    "isFeatured": true
  }'
```

#### **Step 4: Update Job Status to Active**
```bash
curl -X PUT http://localhost:3000/api/jobs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN" \
  -d '{
    "status": "active"
  }'
```

#### **Step 5: View Job Applications**
```bash
curl -X GET "http://localhost:3000/api/client/jobs/1/applications" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN"
```

#### **Step 6: Update Application Status**
```bash
curl -X PUT "http://localhost:3000/api/client/applications/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN" \
  -d '{
    "status": "shortlisted"
  }'
```

#### **Step 7: Create Contract**
```bash
curl -X POST http://localhost:3000/api/client/contracts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN" \
  -d '{
    "freelancerId": 1,
    "workTitle": "React E-commerce Website Development",
    "workDescription": "Build a complete e-commerce website with React frontend and Node.js backend",
    "totalAmount": 2500.00,
    "paymentSchedule": "fixed",
    "contractStartDate": "2024-01-15",
    "contractEndDate": "2024-02-28",
    "deliverables": [
      "Responsive React frontend",
      "Node.js API backend",
      "MongoDB database design",
      "Stripe payment integration",
      "User authentication system"
    ],
    "milestones": [
      {
        "title": "Project Setup & Design",
        "amount": 500,
        "dueDate": "2024-01-22"
      },
      {
        "title": "Frontend Development",
        "amount": 1000,
        "dueDate": "2024-02-05"
      },
      {
        "title": "Backend & Integration",
        "amount": 1000,
        "dueDate": "2024-02-28"
      }
    ]
  }'
```

### **Workflow 3: Agency Journey**

#### **Step 1: Register as Agency**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agency@example.com",
    "password": "password123",
    "firstName": "Tech",
    "lastName": "Solutions",
    "userType": "agency"
  }'
```

#### **Step 2: Create Agency Profile**
```bash
curl -X POST http://localhost:3000/api/agencies/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AGENCY_JWT_TOKEN" \
  -d '{
    "agencyName": "Tech Solutions Inc",
    "description": "We are a leading software development agency specializing in React, Node.js, and mobile applications.",
    "website": "https://techsolutions.com",
    "phone": "+1-555-0123",
    "address": "123 Tech Street, San Francisco, CA 94105",
    "city": "San Francisco",
    "country": "USA",
    "businessType": "corporation",
    "teamSize": 25,
    "yearsInBusiness": 5,
    "specializations": ["react", "node.js", "mobile", "ai", "blockchain"]
  }'
```

#### **Step 3: Search and Hire Freelancers**
```bash
curl -X POST "http://localhost:3000/api/agencies/1/freelancers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AGENCY_JWT_TOKEN" \
  -d '{
    "freelancerId": 1,
    "role": "Senior Developer",
    "commissionRate": 15.0,
    "canApplyJobs": true,
    "canManageProjects": true
  }'
```

## 🔍 **Public API Endpoints (No Authentication Required)**

### **Search All Jobs**
```bash
curl -X GET "http://localhost:3000/api/jobs?search=web&skills=react&budgetMin=1000&budgetMax=5000&page=1&limit=10"
```

### **Get Featured Jobs**
```bash
curl -X GET "http://localhost:3000/api/jobs/featured?limit=5"
```

### **Get Urgent Jobs**
```bash
curl -X GET "http://localhost:3000/api/jobs/urgent?limit=5"
```

### **Get Job Details**
```bash
curl -X GET "http://localhost:3000/api/jobs/1"
```

## 💰 **Connect System Testing**

### **Purchase Connects (Stripe Integration)**
```bash
curl -X POST http://localhost:3000/api/connects/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "package": "basic",
    "quantity": 10,
    "paymentMethodId": "pm_card_visa"
  }'
```

### **Check Connect Balance**
```bash
curl -X GET "http://localhost:3000/api/connects/balance" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Get Connect History**
```bash
curl -X GET "http://localhost:3000/api/connects/history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 💬 **Messaging System Testing**

### **Send Message**
```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "receiverId": 2,
    "content": "Hello! I am interested in your project. I have 5 years of experience in React development.",
    "messageType": "text",
    "contractId": 1
  }'
```

### **Get Messages**
```bash
curl -X GET "http://localhost:3000/api/messages/1?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 **Contract Management Testing**

### **Get All Contracts**
```bash
curl -X GET "http://localhost:3000/api/contracts?page=1&limit=10&status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Accept Contract**
```bash
curl -X PUT "http://localhost:3000/api/contracts/1/accept" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "agreedTerms": true,
    "notes": "I agree to the terms and conditions"
  }'
```

### **Request Payment**
```bash
curl -X POST "http://localhost:3000/api/contracts/1/request-payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000.00,
    "description": "Payment for milestone 1 completion",
    "attachments": ["milestone1-deliverables.pdf"]
  }'
```

### **Release Payment**
```bash
curl -X POST "http://localhost:3000/api/contracts/1/release-payment" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 1000.00,
    "paymentMethodId": "pm_card_visa"
  }'
```

## 🔐 **Authentication Testing**

### **Email Verification**
```bash
curl -X GET "http://localhost:3000/api/auth/verify-email?token=VERIFICATION_TOKEN"
```

### **Forgot Password**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### **Reset Password**
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "RESET_TOKEN",
    "newPassword": "newpassword123"
  }'
```

## 📈 **Analytics and Statistics**

### **Get Job Statistics**
```bash
curl -X GET "http://localhost:3000/api/jobs/1/stats" \
  -H "Authorization: Bearer YOUR_CLIENT_JWT_TOKEN"
```

### **Get User Dashboard Data**
```bash
curl -X GET "http://localhost:3000/api/dashboard" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 **Testing with Postman**

### **Import Collection**
1. Open Postman
2. Click "Import"
3. Import the provided Postman collection JSON
4. Set environment variables:
   - `base_url`: http://localhost:3000
   - `freelancer_token`: Your freelancer JWT token
   - `client_token`: Your client JWT token
   - `agency_token`: Your agency JWT token

### **Environment Variables**
Create a Postman environment with:
```json
{
  "base_url": "http://localhost:3000",
  "freelancer_token": "",
  "client_token": "",
  "agency_token": "",
  "freelancer_id": "",
  "client_id": "",
  "agency_id": "",
  "job_id": "",
  "contract_id": ""
}
```

## 🐛 **Common Issues and Solutions**

### **Port Already in Use**
```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### **Database Connection Issues**
```bash
# Check MySQL status
brew services list | grep mysql

# Start MySQL if not running
brew services start mysql

# Test connection
mysql -u root -e "SELECT 1;"
```

### **JWT Token Issues**
- Ensure token is properly formatted: `Bearer YOUR_TOKEN`
- Check if token has expired
- Verify JWT_SECRET in .env file

### **CORS Issues**
- Ensure CLIENT_URL is set in .env
- Check if frontend is running on the correct port

## 📋 **API Response Codes**

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## 🔍 **Debugging Tips**

### **Enable Debug Logging**
```bash
DEBUG=* npm run dev
```

### **Check Server Logs**
```bash
# View real-time logs
tail -f logs/app.log

# Check error logs
tail -f logs/error.log
```

### **Database Debugging**
```bash
# Connect to MySQL
mysql -u root -p worklab

# Check table structure
DESCRIBE users;
DESCRIBE job_posts;
DESCRIBE job_applications;
```

## 📚 **Additional Resources**

- **Swagger Documentation**: http://localhost:3000/api-docs
- **API Documentation**: `API_DOCUMENTATION.md`
- **Database Setup**: `DATABASE_SETUP.md`
- **Setup Guide**: `SETUP_GUIDE.md`

---

**Happy Testing! 🚀**