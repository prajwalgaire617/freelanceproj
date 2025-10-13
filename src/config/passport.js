const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const jwt = require('jsonwebtoken');
const db = require('../db/models');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth Profile:', profile);
    
    // Check if user already exists with this Google ID
    let user = await db.User.findOne({
      where: { googleId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email
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
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profileImage: profile.photos[0].value,
      userType: 'freelancer', // Default to freelancer, can be changed later
      isEmailVerified: true,
      isActive: true,
      connectBalance: 20 // Give 20 free connects on OAuth signup
    });

    // Create freelancer profile for new users
    await db.Freelancer.create({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      shortBio: 'New freelancer from Google',
      yearsOfExperience: '0-1 years',
      expertise: 'General',
      userType: 'it',
      visibility: 'public'
    });

    // Create connect record for the 20 free connects
    await db.Connect.create({
      userId: user.id,
      type: 'bonus',
      amount: 0, // Free connects
      quantity: 20,
      status: 'completed',
      remaining: 20,
      metadata: {
        description: 'Welcome bonus - 20 free connects for new OAuth users',
        source: 'oauth_signup_bonus',
        provider: 'google'
      }
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('⚠️ Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

// Apple OAuth Strategy
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: process.env.APPLE_PRIVATE_KEY,
    callbackURL: process.env.APPLE_CALLBACK_URL || "/api/auth/apple/callback"
  }, async (accessToken, refreshToken, idToken, profile, done) => {
  try {
    console.log('Apple OAuth Profile:', profile);
    
    // Check if user already exists with this Apple ID
    let user = await db.User.findOne({
      where: { appleId: profile.id }
    });

    if (user) {
      return done(null, user);
    }

    // Check if user exists with same email (if provided)
    if (profile.email) {
      user = await db.User.findOne({
        where: { email: profile.email }
      });

      if (user) {
        // Link Apple account to existing user
        await user.update({ appleId: profile.id });
        return done(null, user);
      }
    }

    // Create new user
    user = await db.User.create({
      appleId: profile.id,
      email: profile.email || `${profile.id}@privaterelay.appleid.com`,
      firstName: profile.name?.firstName || 'Apple',
      lastName: profile.name?.lastName || 'User',
      userType: 'freelancer', // Default to freelancer, can be changed later
      isEmailVerified: true,
      isActive: true,
      connectBalance: 20 // Give 20 free connects on OAuth signup
    });

    // Create freelancer profile for new users
    await db.Freelancer.create({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      shortBio: 'New freelancer from Apple',
      yearsOfExperience: '0-1 years',
      expertise: 'General',
      userType: 'it',
      visibility: 'public'
    });

    // Create connect record for the 20 free connects
    await db.Connect.create({
      userId: user.id,
      type: 'bonus',
      amount: 0, // Free connects
      quantity: 20,
      status: 'completed',
      remaining: 20,
      metadata: {
        description: 'Welcome bonus - 20 free connects for new OAuth users',
        source: 'oauth_signup_bonus',
        provider: 'apple'
      }
    });

    return done(null, user);
  } catch (error) {
    console.error('Apple OAuth Error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('⚠️ Apple OAuth not configured - missing required Apple credentials');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;