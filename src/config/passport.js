const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db/models/index.js');

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'xzoxnco02983h4b2o3soj'
}, async (payload, done) => {
  try {
    const user = await db.User.findByPk(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await db.User.findOne({
      where: { googleId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    user = await db.User.findOne({
      where: { email: profile.emails[0].value }
    });

    if (user) {
      // Link Google account to existing user
      await user.update({ googleId: profile.id });
      return done(null, user);
    }

    // Create new user
    user = await db.User.create({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos[0]?.value,
      googleId: profile.id,
      isEmailVerified: true, // Google emails are pre-verified
      userType: 'freelancer' // Default to freelancer
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'picture']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Facebook ID
    let user = await db.User.findOne({
      where: { facebookId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    if (profile.emails && profile.emails[0]) {
      user = await db.User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (user) {
        // Link Facebook account to existing user
        await user.update({ facebookId: profile.id });
        return done(null, user);
      }
    }

    // Create new user
    user = await db.User.create({
      email: profile.emails?.[0]?.value || `${profile.id}@facebook.com`,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos?.[0]?.value,
      facebookId: profile.id,
      isEmailVerified: true, // Facebook emails are pre-verified
      userType: 'freelancer' // Default to freelancer
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// LinkedIn OAuth Strategy
passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.LINKEDIN_CALLBACK_URL || '/api/auth/linkedin/callback',
  scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this LinkedIn ID
    let user = await db.User.findOne({
      where: { linkedinId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    if (profile.emails && profile.emails[0]) {
      user = await db.User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (user) {
        // Link LinkedIn account to existing user
        await user.update({ linkedinId: profile.id });
        return done(null, user);
      }
    }

    // Create new user
    user = await db.User.create({
      email: profile.emails?.[0]?.value || `${profile.id}@linkedin.com`,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos?.[0]?.value,
      linkedinId: profile.id,
      isEmailVerified: true, // LinkedIn emails are pre-verified
      userType: 'freelancer' // Default to freelancer
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;