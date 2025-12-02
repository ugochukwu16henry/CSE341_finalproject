// Load environment variables if not already loaded
if (!process.env.GOOGLE_CLIENT_ID) {
  require("dotenv").config();
}

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

// Only initialize Google Strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const callbackURL = `${
    process.env.BASE_URL ||
    "https://cse341-finalproject-pow9.onrender.com"
  }/auth/google/callback`;
  
  console.log("🔐 Google OAuth Callback URL:", callbackURL);
  console.log("📝 Make sure this exact URL is added to Google Cloud Console > Authorized redirect URIs");
  
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("🔍 Google OAuth Profile:", {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });

          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              console.log("📝 Updating existing user with Google ID");
              user.googleId = profile.id;
              user.avatar = profile.photos[0]?.value;
              await user.save();
            } else {
              console.log("✨ Creating new user from Google profile");
              user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value || "",
                role: "user",
              });
              await user.save();
            }
          } else {
            console.log("✅ Found existing user with Google ID");
          }

          console.log("👤 User authenticated:", user._id, user.email);
          return done(null, user);
        } catch (err) {
          console.error("❌ OAuth callback error:", err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️  Google OAuth credentials not found. OAuth authentication will not be available.");
}

passport.serializeUser((user, done) => {
  // Use _id (MongoDB default) or id (virtual getter)
  const userId = user._id || user.id;
  done(null, userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

