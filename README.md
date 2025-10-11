# WorkLab Backend API

A modern, scalable backend API for WorkLab (Upwork Clone) built with Node.js, Express, Sequelize, and Centrifugo for real-time messaging.

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd worklab-backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
mysql -u root -p -e "CREATE DATABASE worklab;"
npm run migrate

# Start Centrifugo (real-time messaging)
npm run centrifugo

# Start the API
npm run dev
```

## 📚 Documentation

- **[Complete Setup Guide](SETUP.md)** - Detailed installation and configuration
- **[API Documentation](http://localhost:3001/api-docs)** - Interactive Swagger UI
- **[Health Check](http://localhost:3001/health)** - API status

## 🏗️ Architecture

### Design Patterns
- **Repository Pattern** - Data access abstraction
- **Service Pattern** - Business logic separation
- **Factory Pattern** - Object creation
- **Singleton Pattern** - Service instances

### Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Centrifugo WebSocket server
- **Authentication**: JWT tokens
- **Documentation**: Swagger/OpenAPI

## 🔧 Key Features

- **User Management** - Registration, authentication, profiles
- **Real-time Messaging** - WebSocket-based chat system
- **Job Posting** - Create and manage job posts
- **Payment Processing** - Stripe integration
- **File Upload** - Secure file handling
- **Search & Filtering** - Advanced search capabilities
- **API Documentation** - Interactive Swagger UI
- **Security** - JWT auth, rate limiting, input validation

## 📊 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `GET /api-docs` - API documentation
- `POST /api/auth/login` - User authentication
- `GET /api/users` - User management

### Real-time Messaging
- `POST /api/centrifugo/send-message` - Send message
- `GET /api/centrifugo/history/:userId1/:userId2` - Conversation history

## 🛠️ Development

```bash
# Development mode
npm run dev

# With Centrifugo
npm run dev:full

# Database operations
npm run migrate          # Run migrations
npm run migrate:undo     # Undo migration
npm run db:reset         # Reset database

# Testing
curl http://localhost:3001/health
```

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting and CORS protection
- SQL injection prevention
- XSS and CSRF protection

## 📈 Performance

- Database connection pooling
- Query optimization
- Efficient pagination
- Response compression
- Structured logging

## 🚀 Deployment

See [SETUP.md](SETUP.md) for detailed deployment instructions including:
- Production environment setup
- Docker configuration
- Process management
- Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Setup Issues**: Check [SETUP.md](SETUP.md)
- **API Questions**: Use [API Documentation](http://localhost:3001/api-docs)
- **Bug Reports**: Create an issue on GitHub

---

**Ready to get started?** Check out the [Complete Setup Guide](SETUP.md) for detailed instructions!