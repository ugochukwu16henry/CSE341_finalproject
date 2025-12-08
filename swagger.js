// swagger.js

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CSE341 Final Project API',
    version: '1.0.0',
    description: 'API documentation for appointments and wellness tracking',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
    schemas: {
      Appointment: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Appointment ID',
          },
          userId: {
            type: 'string',
            description: 'User ID',
          },
          therapistId: {
            type: 'string',
            description: 'Therapist ID',
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'Appointment date',
          },
          status: {
            type: 'string',
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled',
          },
          notes: {
            type: 'string',
            maxLength: 500,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['userId', 'therapistId', 'date'],
      },
      WellnessEntry: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Entry ID',
          },
          userId: {
            type: 'string',
            description: 'User ID',
          },
          mood: {
            type: 'string',
            enum: ['happy', 'sad', 'anxious', 'calm', 'angry', 'hopeful'],
          },
          stressLevel: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
          },
          note: {
            type: 'string',
            maxLength: 500,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['userId', 'mood', 'stressLevel'],
      },
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
    },
  },
  paths: {
    '/appointments': {
      get: {
        tags: ['Appointments'],
        summary: 'Get all appointments',
        description: 'Retrieve all appointments',
        responses: {
          '200': {
            description: 'List of appointments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Appointment',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Appointments'],
        summary: 'Create a new appointment',
        description: 'Create a new appointment (requires authentication)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  therapistId: {
                    type: 'string',
                    required: true,
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                    required: true,
                  },
                  status: {
                    type: 'string',
                    enum: ['scheduled', 'completed', 'cancelled'],
                  },
                  notes: {
                    type: 'string',
                    maxLength: 500,
                  },
                },
                required: ['therapistId', 'date'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Appointment created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointment',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Access token required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/appointments/user/{userId}': {
      get: {
        tags: ['Appointments'],
        summary: 'Get appointments for a user',
        description: 'Retrieve all appointments for a specific user',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'List of user appointments',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Appointment',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/appointments/{id}': {
      get: {
        tags: ['Appointments'],
        summary: 'Get appointment by ID',
        description: 'Retrieve a specific appointment by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Appointment ID',
          },
        ],
        responses: {
          '200': {
            description: 'Appointment details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointment',
                },
              },
            },
          },
          '404': {
            description: 'Appointment not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Appointments'],
        summary: 'Update an appointment',
        description: 'Update an existing appointment (requires authentication)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Appointment ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  therapistId: {
                    type: 'string',
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                  },
                  status: {
                    type: 'string',
                    enum: ['scheduled', 'completed', 'cancelled'],
                  },
                  notes: {
                    type: 'string',
                    maxLength: 500,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Appointment updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Appointment',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Access token required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Appointment not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Appointments'],
        summary: 'Delete an appointment',
        description: 'Delete an appointment (requires authentication)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Appointment ID',
          },
        ],
        responses: {
          '200': {
            description: 'Appointment deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Appointment deleted',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Access token required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Appointment not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/wellness': {
      get: {
        tags: ['Wellness'],
        summary: 'Get all wellness entries',
        description: 'Retrieve all wellness entries',
        responses: {
          '200': {
            description: 'List of wellness entries',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/WellnessEntry',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Wellness'],
        summary: 'Create a new wellness entry',
        description: 'Create a new wellness entry (requires authentication)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mood: {
                    type: 'string',
                    enum: ['happy', 'sad', 'anxious', 'calm', 'angry', 'hopeful'],
                    required: true,
                  },
                  stressLevel: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 10,
                    required: true,
                  },
                  note: {
                    type: 'string',
                    maxLength: 500,
                  },
                },
                required: ['mood', 'stressLevel'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Wellness entry created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WellnessEntry',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Access token required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/wellness/user/{userId}': {
      get: {
        tags: ['Wellness'],
        summary: 'Get wellness entries for a user',
        description: 'Retrieve all wellness entries for a specific user',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'User ID',
          },
        ],
        responses: {
          '200': {
            description: 'List of user wellness entries',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/WellnessEntry',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/wellness/{id}': {
      get: {
        tags: ['Wellness'],
        summary: 'Get wellness entry by ID',
        description: 'Retrieve a specific wellness entry by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Wellness entry ID',
          },
        ],
        responses: {
          '200': {
            description: 'Wellness entry details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WellnessEntry',
                },
              },
            },
          },
          '404': {
            description: 'Entry not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Wellness'],
        summary: 'Update a wellness entry',
        description: 'Update an existing wellness entry (requires authentication)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Wellness entry ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mood: {
                    type: 'string',
                    enum: ['happy', 'sad', 'anxious', 'calm', 'angry', 'hopeful'],
                  },
                  stressLevel: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 10,
                  },
                  note: {
                    type: 'string',
                    maxLength: 500,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Wellness entry updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WellnessEntry',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Access token required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Entry not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Wellness'],
        summary: 'Delete a wellness entry',
        description: 'Delete a wellness entry (requires authentication)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Wellness entry ID',
          },
        ],
        responses: {
          '200': {
            description: 'Wellness entry deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Entry deleted',
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized - Access token required',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Entry not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDefinition;

