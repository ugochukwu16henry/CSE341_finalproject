// src/app.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Initialize Express app
const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins in development
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session configuration with MongoDB store
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Use MongoDB store if MONGODB_URI is available, otherwise use MemoryStore (development only)
if (process.env.MONGODB_URI && process.env.NODE_ENV !== 'test') {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60, // 24 hours in seconds
  });
} else if (process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Using MemoryStore in production. Set MONGODB_URI for persistent sessions.');
}

app.use(session(sessionConfig));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Database connection (skip in test mode - tests use MongoDB Memory Server)
if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./config/db');
  connectDB();
}

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/therapists', therapistRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/wellness', wellnessRoutes);

// Swagger setup
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Global Counseling API',
      version: '1.0.0',
      description: 'Backend API for mental health and family wellness platform',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }], // Optional: apply globally; we'll override per route
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Adjust if you add JSDoc
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Global Counseling API is running!' });
});

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server only if this file is run directly (not required by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
