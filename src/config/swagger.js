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
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.worklab.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        googleOAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
              tokenUrl: 'https://oauth2.googleapis.com/token',
              scopes: {
                'openid': 'OpenID Connect',
                'email': 'Email address',
                'profile': 'Basic profile information'
              }
            }
          }
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'firstName', 'lastName', 'userType'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid',
              example: 'b57edd34-94bd-44fb-a47e-ade925953ebc'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            userType: {
              type: 'string',
              enum: ['freelancer', 'client', 'agency'],
              example: 'freelancer'
            },
            isEmailVerified: {
              type: 'boolean',
              example: false
            },
            profileImage: {
              type: 'string',
              example: 'https://example.com/profile.jpg'
            },
            connectBalance: {
              type: 'integer',
              example: 10
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        JobApplication: {
          type: 'object',
          required: ['jobPostId', 'coverLetter'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            jobPostId: {
              type: 'integer',
              example: 1
            },
            coverLetter: {
              type: 'string',
              example: 'I am interested in this position...'
            },
            proposedRate: {
              type: 'number',
              format: 'float',
              example: 25.00
            },
            proposedTimeline: {
              type: 'string',
              example: '2 weeks'
            },
            status: {
              type: 'string',
              enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted', 'withdrawn'],
              example: 'pending'
            },
            appliedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Contract: {
          type: 'object',
          required: ['freelancerId', 'workTitle', 'workDescription'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            freelancerId: {
              type: 'integer',
              example: 2
            },
            clientId: {
              type: 'integer',
              example: 1
            },
            workTitle: {
              type: 'string',
              example: 'Website Development'
            },
            workDescription: {
              type: 'string',
              example: 'Build a responsive website...'
            },
            totalAmount: {
              type: 'number',
              format: 'float',
              example: 1500.00
            },
            paymentSchedule: {
              type: 'string',
              enum: ['hourly', 'fixed', 'milestone'],
              example: 'fixed'
            },
            contractStatus: {
              type: 'string',
              enum: ['draft', 'pending', 'active', 'completed', 'cancelled', 'disputed'],
              example: 'draft'
            },
            contractStartDate: {
              type: 'string',
              format: 'date'
            },
            contractEndDate: {
              type: 'string',
              format: 'date'
            }
          }
        },
        Connect: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            type: {
              type: 'string',
              enum: ['purchased', 'earned', 'bonus', 'refund'],
              example: 'purchased'
            },
            amount: {
              type: 'number',
              format: 'float',
              example: 1.50
            },
            quantity: {
              type: 'integer',
              example: 10
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'failed', 'refunded'],
              example: 'completed'
            },
            remaining: {
              type: 'integer',
              example: 5
            }
          }
        },
        Message: {
          type: 'object',
          required: ['receiverId', 'content'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            senderId: {
              type: 'integer',
              example: 1
            },
            receiverId: {
              type: 'integer',
              example: 2
            },
            content: {
              type: 'string',
              example: 'Hello! I am interested in your project.'
            },
            messageType: {
              type: 'string',
              enum: ['text', 'image', 'file', 'system'],
              example: 'text'
            },
            isRead: {
              type: 'boolean',
              example: false
            },
            sentAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        JobPost: {
          type: 'object',
          required: ['title', 'description', 'budget', 'budgetType'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            title: {
              type: 'string',
              example: 'Build a React E-commerce Website'
            },
            description: {
              type: 'string',
              example: 'I need a professional e-commerce website built with React, Node.js, and MongoDB.'
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
            minBudget: {
              type: 'number',
              format: 'float',
              example: 1000.00
            },
            maxBudget: {
              type: 'number',
              format: 'float',
              example: 5000.00
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['react', 'javascript', 'node.js', 'mongodb']
            },
            experienceLevel: {
              type: 'string',
              enum: ['entry', 'intermediate', 'expert'],
              example: 'expert'
            },
            projectDuration: {
              type: 'string',
              example: '4-6 weeks'
            },
            timezone: {
              type: 'string',
              example: 'EST'
            },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
              example: 'active'
            },
            connectRequired: {
              type: 'integer',
              example: 3
            },
            isFeatured: {
              type: 'boolean',
              example: true
            },
            isUrgent: {
              type: 'boolean',
              example: false
            },
            isPublic: {
              type: 'boolean',
              example: true
            },
            clientId: {
              type: 'integer',
              example: 1
            },
            organizationId: {
              type: 'integer',
              example: 1
            },
            client: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Freelancer: {
          type: 'object',
          required: ['firstName', 'lastName', 'expertise'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            expertise: {
              type: 'string',
              example: 'Full Stack Developer'
            },
            shortBio: {
              type: 'string',
              example: 'Experienced developer with 5+ years in React and Node.js'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['react', 'javascript', 'node.js', 'mongodb']
            },
            hourlyRate: {
              type: 'number',
              format: 'float',
              example: 25.00
            },
            city: {
              type: 'string',
              example: 'New York'
            },
            country: {
              type: 'string',
              example: 'USA'
            },
            timezone: {
              type: 'string',
              example: 'EST'
            },
            availability: {
              type: 'string',
              enum: ['available', 'busy', 'unavailable'],
              example: 'available'
            },
            profileImage: {
              type: 'string',
              example: 'https://example.com/profile.jpg'
            },
            portfolio: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  url: { type: 'string' },
                  image: { type: 'string' }
                }
              }
            },
            isVerified: {
              type: 'boolean',
              example: false
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            userId: {
              type: 'integer',
              example: 1
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Agency: {
          type: 'object',
          required: ['agencyName'],
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            uuid: {
              type: 'string',
              format: 'uuid'
            },
            agencyName: {
              type: 'string',
              example: 'Tech Solutions Inc'
            },
            description: {
              type: 'string',
              example: 'We provide top-notch development services...'
            },
            website: {
              type: 'string',
              example: 'https://techsolutions.com'
            },
            city: {
              type: 'string',
              example: 'New York'
            },
            country: {
              type: 'string',
              example: 'USA'
            },
            teamSize: {
              type: 'integer',
              example: 25
            },
            isVerified: {
              type: 'boolean',
              example: false
            },
            isActive: {
              type: 'boolean',
              example: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            },
            message: {
              type: 'string',
              example: 'Detailed error description'
            }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string'
                  },
                  param: {
                    type: 'string'
                  },
                  location: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        WebSocketMessage: {
          type: 'object',
          required: ['receiverId', 'content'],
          properties: {
            receiverId: {
              type: 'integer',
              example: 2,
              description: 'ID of the user receiving the message'
            },
            content: {
              type: 'string',
              example: 'Hello! I am interested in your project.',
              description: 'Message content'
            },
            messageType: {
              type: 'string',
              enum: ['text', 'image', 'file', 'system'],
              default: 'text',
              example: 'text',
              description: 'Type of message being sent'
            },
            attachments: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: [],
              description: 'Array of attachment URLs or IDs'
            }
          }
        },
        WebSocketEvent: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              example: 'new_message',
              description: 'WebSocket event name'
            },
            data: {
              type: 'object',
              description: 'Event data payload'
            }
          }
        },
        TypingIndicator: {
          type: 'object',
          required: ['partnerId'],
          properties: {
            partnerId: {
              type: 'integer',
              example: 2,
              description: 'ID of the conversation partner'
            }
          }
        },
        ConversationRoom: {
          type: 'object',
          required: ['partnerId'],
          properties: {
            partnerId: {
              type: 'integer',
              example: 2,
              description: 'ID of the conversation partner'
            }
          }
        },
        CentrifugoToken: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: { 
              type: 'integer', 
              example: 1, 
              description: 'ID of the user requesting the token' 
            },
            userInfo: { 
              type: 'object', 
              example: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
              description: 'Additional user information to include in the token'
            }
          }
        },
        CentrifugoMessage: {
          type: 'object',
          required: ['senderId', 'receiverId', 'content'],
          properties: {
            senderId: { 
              type: 'integer', 
              example: 1, 
              description: 'ID of the user sending the message' 
            },
            receiverId: { 
              type: 'integer', 
              example: 2, 
              description: 'ID of the user receiving the message' 
            },
            content: { 
              type: 'string', 
              example: 'Hello! I am interested in your project.', 
              description: 'Message content' 
            },
            messageType: { 
              type: 'string', 
              enum: ['text', 'image', 'file', 'system'], 
              default: 'text', 
              example: 'text', 
              description: 'Type of message being sent' 
            },
            attachments: { 
              type: 'array', 
              items: { type: 'string' }, 
              example: [], 
              description: 'Array of attachment URLs or IDs' 
            }
          }
        },
        CentrifugoChannel: {
          type: 'object',
          properties: {
            name: { 
              type: 'string', 
              example: 'chat:conversation:1_2', 
              description: 'Channel name' 
            },
            publish: { 
              type: 'boolean', 
              example: true, 
              description: 'Whether publishing is allowed' 
            },
            subscribe_to_publish: { 
              type: 'boolean', 
              example: true, 
              description: 'Whether subscription is required for publishing' 
            },
            presence: { 
              type: 'boolean', 
              example: true, 
              description: 'Whether presence is enabled' 
            },
            join_leave: { 
              type: 'boolean', 
              example: true, 
              description: 'Whether join/leave events are enabled' 
            },
            history_size: { 
              type: 'integer', 
              example: 50, 
              description: 'Maximum number of messages to keep in history' 
            },
            history_ttl: { 
              type: 'string', 
              example: '7d', 
              description: 'Time to live for message history' 
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/websocket': {
        get: {
          tags: ['WebSocket'],
          summary: 'WebSocket Connection',
          description: 'Establish a WebSocket connection for real-time chat functionality. This endpoint provides real-time messaging, typing indicators, and message notifications.',
          parameters: [
            {
              name: 'token',
              in: 'query',
              required: true,
              schema: {
                type: 'string'
              },
              description: 'JWT authentication token'
            }
          ],
          responses: {
            '101': {
              description: 'WebSocket connection established successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'connected'
                      },
                      message: {
                        type: 'string',
                        example: 'WebSocket connection established'
                      }
                    }
                  }
                }
              }
            },
            '401': {
              description: 'Authentication failed',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        '/api/centrifugo/token': {
          post: {
            tags: ['Centrifugo'],
            summary: 'Generate Centrifugo Token',
            description: 'Generate a JWT token for authenticating with the Centrifugo real-time server',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CentrifugoToken'
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Token generated successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        centrifugoUrl: { type: 'string', example: 'ws://localhost:8000/connection/websocket' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Bad request - User ID required',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        },
        '/api/centrifugo/send-message': {
          post: {
            tags: ['Centrifugo'],
            summary: 'Send Message via Centrifugo',
            description: 'Send a real-time message through Centrifugo channels',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/CentrifugoMessage'
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Message sent successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        message: { $ref: '#/components/schemas/Message' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Bad request - Missing required fields',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        },
        '/api/centrifugo/history/{userId1}/{userId2}': {
          get: {
            tags: ['Centrifugo'],
            summary: 'Get Conversation History',
            description: 'Retrieve message history for a conversation between two users',
            parameters: [
              {
                name: 'userId1',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                description: 'First user ID'
              },
              {
                name: 'userId2',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                description: 'Second user ID'
              }
            ],
            responses: {
              '200': {
                description: 'History retrieved successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        history: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/centrifugo/presence/{userId1}/{userId2}': {
          get: {
            tags: ['Centrifugo'],
            summary: 'Get Channel Presence',
            description: 'Get online users in a conversation channel',
            parameters: [
              {
                name: 'userId1',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                description: 'First user ID'
              },
              {
                name: 'userId2',
                in: 'path',
                required: true,
                schema: { type: 'integer' },
                description: 'Second user ID'
              }
            ],
            responses: {
              '200': {
                description: 'Presence retrieved successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        presence: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/centrifugo/mark-read': {
          post: {
            tags: ['Centrifugo'],
            summary: 'Mark Message as Read',
            description: 'Mark a message as read and notify the sender',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['messageId', 'userId'],
                    properties: {
                      messageId: { type: 'integer', example: 1, description: 'ID of the message to mark as read' },
                      userId: { type: 'integer', example: 2, description: 'ID of the user marking the message as read' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Message marked as read successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Message marked as read' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Bad request - Missing required fields',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              },
              '404': {
                description: 'Message not found or already read',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/docs/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
