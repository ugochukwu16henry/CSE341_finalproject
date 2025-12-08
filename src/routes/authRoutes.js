// src/routes/authRoutes.js

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 *
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth
 *
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects after authentication
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Google OAuth initiation
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false, // We're using JWT, not sessions
  }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirect with token (you can customize this based on your frontend)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect('/auth/failure');
    }
  }
);

// Auth failure route
router.get('/failure', (req, res) => {
  res.json({
    success: false,
    message: 'Authentication failed',
  });
});

// Get current user (protected route)
router.get('/me', passport.authenticate('google', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
