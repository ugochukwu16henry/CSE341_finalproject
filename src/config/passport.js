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
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              user.avatar = profile.photos[0].value;
              await user.save();
            } else {
              user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value || "",
                role: "user",
              });
              await user.save();
            }
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️  Google OAuth credentials not found. OAuth authentication will not be available.");
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

