// src/routes/authRoutes.js

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 *
 * /auth:
 *   get:
 *     summary: Get auth information
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Auth routes information
 */

const express = require('express');
const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.json({ message: 'Auth routes' });
});

module.exports = router;
