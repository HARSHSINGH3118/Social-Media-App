const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findUserByEmail, createOAuthUser } = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName;
        const avatar = profile.photos?.[0]?.value || null;
        const provider = "google";

        let user = await findUserByEmail(email);
        if (!user) {
          user = await createOAuthUser({ email, username, avatar, provider });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
