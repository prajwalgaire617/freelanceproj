# Swagger Documentation Setup Guide

Complete guide for setting up and using Swagger documentation for the WorkLab API.

## 🚀 **Quick Start**

### **Access Swagger UI**
Once the server is running, visit:
```
http://localhost:3000/api-docs/
```

### **View API Documentation**
The Swagger UI provides:
- Interactive API testing
- Complete endpoint documentation
- Request/response examples
- Authentication testing
- Schema definitions

## 📋 **Prerequisites**

### **Required Dependencies**
The following packages are already included in `package.json`:
```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0"
}
```

### **Installation**
```bash
npm install swagger-jsdoc swagger-ui-express
```

## ⚙️ **Configuration**

### **Swagger Configuration File**
Located at: `src/config/swagger.js`

```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WorkLab API',
      version: '1.0.0',
      description: 'A comprehensive backend API for a freelance marketplace platform similar to Upwork',
      contact: {
        name: 'WorkLab Team',
        email: 'support@worklab.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        // Schema definitions here
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
```

### **Integration in Express App**
Located at: `src/app.js`

```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'WorkLab API Documentation'
}));
```

## 📝 **Adding Documentation to Routes**

### **Basic Route Documentation**
```javascript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 */
router.post('/register', registerUser);
```

### **Advanced Route Documentation**
```javascript
/**
 * @swagger
 * /api/freelancer/jobs/search:
 *   get:
 *     summary: Search jobs for freelancers
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for job title/description
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated skills
 *       - in: query
 *         name: budgetMin
 *         schema:
 *           type: number
 *         description: Minimum budget
 *       - in: query
 *         name: budgetMax
 *         schema:
 *           type: number
 *         description: Maximum budget
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPost'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/jobs/search', authenticateToken, searchJobs);
```

## 🏗️ **Schema Definitions**

### **Adding New Schemas**
Add schemas to `src/config/swagger.js`:

```javascript
schemas: {
  JobPost: {
    type: 'object',
    required: ['title', 'description', 'budget', 'budgetType'],
    properties: {
      id: {
        type: 'integer',
        example: 1
      },
      title: {
        type: 'string',
        example: 'Build a React E-commerce Website'
      },
      description: {
        type: 'string',
        example: 'I need a professional e-commerce website...'
      },
      budget: {
        type: 'number',
        format: 'float',
        example: 2500.00
      },
      budgetType: {
        type: 'string',
        enum: ['hourly', 'fixed'],
        example: 'fixed'
      },
      skills: {
        type: 'array',
        items: {
          type: 'string'
        },
        example: ['react', 'javascript', 'node.js']
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
        example: 'active'
      },
      createdAt: {
        type: 'string',
        format: 'date-time'
      }
    }
  }
}
```

### **Common Schema Patterns**

#### **Pagination Schema**
```javascript
Pagination: {
  type: 'object',
  properties: {
    currentPage: {
      type: 'integer',
      example: 1
    },
    totalPages: {
      type: 'integer',
      example: 10
    },
    totalItems: {
      type: 'integer',
      example: 100
    },
    hasNext: {
      type: 'boolean',
      example: true
    },
    hasPrev: {
      type: 'boolean',
      example: false
    }
  }
}
```

#### **Error Schema**
```javascript
Error: {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false
    },
    error: {
      type: 'string',
      example: 'Error message'
    },
    message: {
      type: 'string',
      example: 'Detailed error description'
    },
    code: {
      type: 'string',
      example: 'ERROR_CODE'
    }
  }
}
```

## 🔐 **Authentication Documentation**

### **Bearer Token Authentication**
```javascript
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter JWT token
 */
```

### **Using Authentication in Routes**
```javascript
/**
 * @swagger
 * /api/protected-route:
 *   get:
 *     summary: Protected endpoint
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
```

## 🎨 **Customization**

### **Custom CSS**
```javascript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0 }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 10px }
  `,
  customSiteTitle: 'WorkLab API Documentation',
  customfavIcon: '/favicon.ico'
}));
```

### **Custom Options**
```javascript
const swaggerOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
    tryItOutEnabled: true
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));
```

## 🧪 **Testing with Swagger UI**

### **1. Authentication Testing**
1. Go to `/api-docs/`
2. Click "Authorize" button
3. Enter your JWT token: `Bearer your-jwt-token`
4. Click "Authorize"

### **2. Endpoint Testing**
1. Find the endpoint you want to test
2. Click "Try it out"
3. Fill in the required parameters
4. Click "Execute"
5. View the response

### **3. Schema Validation**
1. Check the "Schemas" section
2. Review request/response models
3. Validate your data against schemas

## 📊 **Available Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/verify-email` - Verify email

### **Freelancer**
- `GET /api/freelancer/jobs/search` - Search jobs
- `GET /api/freelancer/jobs/:id` - Get job details
- `GET /api/freelancer/applications` - Get my applications
- `GET /api/freelancer/connects` - Get connect balance

### **Client**
- `GET /api/client/freelancers/search` - Search freelancers
- `POST /api/client/jobs` - Create job post
- `GET /api/client/jobs` - Get my job posts
- `GET /api/client/jobs/:id/applications` - Get job applications

### **Public Jobs**
- `GET /api/jobs` - Search all jobs
- `GET /api/jobs/:id` - Get job details
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/urgent` - Get urgent jobs

### **Job Applications**
- `POST /api/job-applications/apply` - Apply to job

### **Connects**
- `POST /api/connects/purchase` - Purchase connects
- `GET /api/connects/balance` - Get connect balance
- `GET /api/connects/history` - Get connect history

### **Contracts**
- `POST /api/contracts` - Create contract
- `GET /api/contracts` - Get contracts
- `PUT /api/contracts/:id/accept` - Accept contract
- `POST /api/contracts/:id/request-payment` - Request payment
- `POST /api/contracts/:id/release-payment` - Release payment

### **Messages**
- `POST /api/messages/send` - Send message
- `GET /api/messages/:contractId` - Get messages

### **Agencies**
- `POST /api/agencies/profile` - Create agency profile
- `POST /api/agencies/:id/freelancers` - Hire freelancer

## 🔧 **Development Workflow**

### **1. Add New Endpoint**
1. Create route in appropriate route file
2. Add JSDoc comments with Swagger annotations
3. Define schemas if needed
4. Test in Swagger UI

### **2. Update Existing Endpoint**
1. Modify JSDoc comments
2. Update schemas if needed
3. Test changes in Swagger UI

### **3. Add New Schema**
1. Add schema to `swagger.js`
2. Reference schema in route documentation
3. Test schema validation

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Swagger UI Not Loading**
```bash
# Check if server is running
curl http://localhost:3000/health

# Check if swagger endpoint is accessible
curl http://localhost:3000/api-docs/
```

#### **Schema Not Found Error**
- Ensure schema is defined in `swagger.js`
- Check schema reference syntax: `$ref: '#/components/schemas/SchemaName'`
- Verify schema name matches exactly

#### **Authentication Not Working**
- Check if JWT token is valid
- Ensure token format: `Bearer your-token`
- Verify token hasn't expired

#### **CORS Issues**
- Check CORS configuration in `app.js`
- Ensure `CLIENT_URL` is set in `.env`

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=swagger* npm run dev

# Check swagger spec generation
node -e "console.log(JSON.stringify(require('./src/config/swagger'), null, 2))"
```

## 📚 **Best Practices**

### **1. Documentation Standards**
- Use clear, descriptive summaries
- Include all required parameters
- Provide realistic examples
- Document all possible responses

### **2. Schema Design**
- Use consistent naming conventions
- Include validation rules
- Provide meaningful examples
- Group related schemas

### **3. Security**
- Document authentication requirements
- Include security schemes
- Show proper token usage
- Document rate limiting

### **4. Testing**
- Test all endpoints in Swagger UI
- Validate request/response schemas
- Test authentication flows
- Verify error responses

## 📖 **Additional Resources**

- **OpenAPI Specification**: https://swagger.io/specification/
- **Swagger JSDoc**: https://github.com/Surnet/swagger-jsdoc
- **Swagger UI Express**: https://github.com/scottie1984/swagger-ui-express
- **API Documentation**: `API_DOCUMENTATION.md`
- **Testing Guide**: `API_TESTING_GUIDE.md`

---

**Happy Documenting! 📚**