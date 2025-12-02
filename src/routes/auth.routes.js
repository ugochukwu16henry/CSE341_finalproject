const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth
 *       503:
 *         description: OAuth not configured
 */
router.get(
  "/google",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(503).json({ 
        error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables." 
      });
    }
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback - returns JWT token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns HTML page with JWT token
 */
router.get(
  "/google/callback",
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(503).json({ 
        error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables." 
      });
    }
    next();
  },
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured." });
    }
    const token = jwt.sign({ id: req.user.id || req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // For demo/video: redirect to simple page with token
    res.send(`
      <h2>Login Successful!</h2>
      <p>Copy this JWT token for testing protected routes:</p>
      <textarea style="width:100%;height:100px">${token}</textarea>
      <script>navigator.clipboard.writeText("${token}")</script>
    `);
  }
);

/**
 * @swagger
 * /auth/test-token:
 *   post:
 *     summary: Generate JWT token for testing (DEV ONLY)
 *     tags: [Authentication]
 *     description: Creates or finds a user by email and returns a JWT token. For testing purposes only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@example.com
 *               name:
 *                 type: string
 *                 example: Test User
 *     responses:
 *       200:
 *         description: JWT token generated successfully
 *       400:
 *         description: Email is required
 *       500:
 *         description: JWT_SECRET not configured
 */
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (JWT-based - client should discard token)
 *     tags: [Authentication]
 *     description: Since we use JWT tokens, logout is handled client-side by discarding the token. This endpoint provides a confirmation message.
 *     responses:
 *       200:
 *         description: Logout successful (client should discard token)
 */
router.post("/logout", (req, res) => {
  res.status(200).json({
    message: "Logout successful. Please discard your JWT token on the client side.",
  });
});

router.post("/test-token", async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not configured." });
    }

    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const User = require("../models/user.model");
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        role: "user",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Test token generated successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
