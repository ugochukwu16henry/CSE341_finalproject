const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Global Counseling API",
      version: "1.0.0",
      description: "Backend API for mental health and family wellness platform",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://cse341-finalproject-pow9.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // paths to files with JSDoc comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;