// src/config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables if not already loaded
if (!process.env.GOOGLE_CLIENT_ID) {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });
}

// Only configure Google OAuth if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 
          `${process.env.BASE_URL || 'http://localhost:5000'}/auth/google/callback`,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return user
          return done(null, user);
        } else {
          // Check if user exists with this email
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // User exists but doesn't have googleId, update it
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
          } else {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              role: 'user',
            });
            return done(null, user);
          }
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
  );
} else {
  console.warn('WARNING: Google OAuth credentials not found. OAuth authentication will not work.');
  console.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
