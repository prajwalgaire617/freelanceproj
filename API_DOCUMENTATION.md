# WorkLab API Documentation

Complete API documentation for the WorkLab Upwork Clone Backend.

## 🌐 **Base URL**
```
Development: http://localhost:3000
Production: https://api.worklab.com
```

## 🔐 **Authentication**

### **JWT Bearer Token**
Most endpoints require authentication using JWT tokens in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### **OAuth2 (Google)**
For Google OAuth authentication, use the OAuth2 flow with the provided client ID.

## 📋 **API Endpoints**

### **Authentication Endpoints**

#### **Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "freelancer"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email to verify your account.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "uuid": "b57edd34-94bd-44fb-a47e-ade925953ebc",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "freelancer",
    "isEmailVerified": false
  }
}
```

#### **Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### **Get User Profile**
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### **Verify Email**
```http
GET /api/auth/verify-email?token=<verification-token>
```

### **Freelancer Endpoints**

#### **Search Jobs**
```http
GET /api/freelancer/jobs/search?searchTerm=react&skills=javascript&budgetMin=500&budgetMax=5000&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `searchTerm` (string): Search term for job title/description
- `skills` (string): Comma-separated skills
- `budgetMin` (number): Minimum budget
- `budgetMax` (number): Maximum budget
- `experienceLevel` (string): entry, intermediate, expert
- `projectDuration` (string): Project duration filter
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)

#### **Get Job Details**
```http
GET /api/freelancer/jobs/:id
Authorization: Bearer <token>
```

#### **Get My Applications**
```http
GET /api/freelancer/applications?page=1&limit=10
Authorization: Bearer <token>
```

#### **Get Connect Balance**
```http
GET /api/freelancer/connects
Authorization: Bearer <token>
```

### **Client Endpoints**

#### **Search Freelancers**
```http
GET /api/client/freelancers/search?searchTerm=react&skills=javascript&hourlyRateMin=20&hourlyRateMax=100&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `searchTerm` (string): Search term for freelancer name/expertise
- `skills` (string): Comma-separated skills
- `hourlyRateMin` (number): Minimum hourly rate
- `hourlyRateMax` (number): Maximum hourly rate
- `location` (string): City or country
- `availability` (string): available, busy, unavailable
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 10)

#### **Create Job Post**
```http
POST /api/client/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build a React E-commerce Website",
  "description": "I need a professional e-commerce website built with React, Node.js, and MongoDB.",
  "budget": 2500,
  "budgetType": "fixed",
  "skills": ["react", "javascript", "node.js", "mongodb"],
  "experienceLevel": "expert",
  "projectDuration": "4-6 weeks",
  "timezone": "EST",
  "connectRequired": 3,
  "isUrgent": false,
  "isFeatured": true
}
```

#### **Get My Job Posts**
```http
GET /api/client/jobs?page=1&limit=10
Authorization: Bearer <token>
```

#### **Get Job Applications**
```http
GET /api/client/jobs/:jobId/applications
Authorization: Bearer <token>
```

#### **Update Application Status**
```http
PUT /api/client/applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shortlisted"
}
```

### **Public Job Endpoints**

#### **Search All Jobs**
```http
GET /api/jobs?search=web&skills=react&budgetMin=1000&budgetMax=5000&page=1&limit=10
```

#### **Get Job Details**
```http
GET /api/jobs/:id
```

#### **Get Featured Jobs**
```http
GET /api/jobs/featured?limit=5
```

#### **Get Urgent Jobs**
```http
GET /api/jobs/urgent?limit=5
```

### **Job Application Endpoints**

#### **Apply to Job**
```http
POST /api/job-applications/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobPostId": 1,
  "coverLetter": "I am very interested in this React project. I have 5 years of experience in React development.",
  "proposedRate": 25.00,
  "proposedTimeline": "2 weeks"
}
```

### **Connect System Endpoints**

#### **Purchase Connects**
```http
POST /api/connects/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "package": "basic",
  "quantity": 10,
  "paymentMethodId": "pm_card_visa"
}
```

#### **Get Connect Balance**
```http
GET /api/connects/balance
Authorization: Bearer <token>
```

#### **Get Connect History**
```http
GET /api/connects/history?page=1&limit=10
Authorization: Bearer <token>
```

### **Contract Endpoints**

#### **Create Contract**
```http
POST /api/contracts
Authorization: Bearer <token>
Content-Type: application/json

{
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
    "Stripe payment integration"
  ]
}
```

#### **Get Contracts**
```http
GET /api/contracts?page=1&limit=10&status=active
Authorization: Bearer <token>
```

#### **Accept Contract**
```http
PUT /api/contracts/:id/accept
Authorization: Bearer <token>
Content-Type: application/json

{
  "agreedTerms": true,
  "notes": "I agree to the terms and conditions"
}
```

#### **Request Payment**
```http
POST /api/contracts/:id/request-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000.00,
  "description": "Payment for milestone 1 completion",
  "attachments": ["milestone1-deliverables.pdf"]
}
```

#### **Release Payment**
```http
POST /api/contracts/:id/release-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000.00,
  "paymentMethodId": "pm_card_visa"
}
```

### **Messaging Endpoints**

#### **Send Message**
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": 2,
  "content": "Hello! I am interested in your project. I have 5 years of experience in React development.",
  "messageType": "text",
  "contractId": 1
}
```

#### **Get Messages**
```http
GET /api/messages/:contractId?page=1&limit=20
Authorization: Bearer <token>
```

### **Agency Endpoints**

#### **Create Agency Profile**
```http
POST /api/agencies/profile
Authorization: Bearer <token>
Content-Type: application/json

{
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
}
```

#### **Hire Freelancer**
```http
POST /api/agencies/:agencyId/freelancers
Authorization: Bearer <token>
Content-Type: application/json

{
  "freelancerId": 1,
  "role": "Senior Developer",
  "commissionRate": 15.0,
  "canApplyJobs": true,
  "canManageProjects": true
}
```

## 📊 **Response Formats**

### **Success Response**
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description",
  "code": "ERROR_CODE"
}
```

### **Validation Error Response**
```json
{
  "success": false,
  "error": "Validation Error",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### **Pagination Response**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔒 **Error Codes**

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

## 🚀 **Rate Limiting**

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **File Upload**: 10 requests per 15 minutes

## 📝 **Request/Response Examples**

### **Complete Freelancer Workflow**

1. **Register as Freelancer**
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

2. **Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "freelancer@example.com",
    "password": "password123"
  }'
```

3. **Search Jobs**
```bash
curl -X GET "http://localhost:3000/api/freelancer/jobs/search?searchTerm=react&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

4. **Apply to Job**
```bash
curl -X POST http://localhost:3000/api/job-applications/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "jobPostId": 1,
    "coverLetter": "I am very interested in this React project...",
    "proposedRate": 25.00,
    "proposedTimeline": "2 weeks"
  }'
```

### **Complete Client Workflow**

1. **Register as Client**
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

2. **Create Job Post**
```bash
curl -X POST http://localhost:3000/api/client/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN" \
  -d '{
    "title": "Build a React E-commerce Website",
    "description": "I need a professional e-commerce website...",
    "budget": 2500,
    "budgetType": "fixed",
    "skills": ["react", "javascript", "node.js"],
    "experienceLevel": "expert",
    "projectDuration": "4-6 weeks",
    "connectRequired": 3
  }'
```

3. **View Applications**
```bash
curl -X GET "http://localhost:3000/api/client/jobs/1/applications" \
  -H "Authorization: Bearer YOUR_CLIENT_TOKEN"
```

## 🔧 **SDK Examples**

### **JavaScript/Node.js**
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Search jobs
const searchJobs = async (searchTerm) => {
  try {
    const response = await api.get(`/api/jobs?search=${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching jobs:', error.response.data);
  }
};
```

### **Python**
```python
import requests

class WorkLabAPI:
    def __init__(self, base_url="http://localhost:3000", token=None):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Content-Type': 'application/json'
        }
        if token:
            self.headers['Authorization'] = f'Bearer {token}'
    
    def search_jobs(self, search_term, **kwargs):
        url = f"{self.base_url}/api/jobs"
        params = {'search': search_term, **kwargs}
        response = requests.get(url, headers=self.headers, params=params)
        return response.json()

# Usage
api = WorkLabAPI(token="your-jwt-token")
jobs = api.search_jobs("react", limit=10)
```

## 📚 **Additional Resources**

- **Swagger UI**: http://localhost:3000/api-docs/
- **Postman Collection**: `WorkLab_API.postman_collection.json`
- **Setup Guide**: `SETUP_GUIDE.md`
- **Testing Guide**: `API_TESTING_GUIDE.md`

---

**For more information, visit our [GitHub repository](https://github.com/your-org/worklab-api) or contact support.**