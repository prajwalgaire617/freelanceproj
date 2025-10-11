const asyncHandler = require('express-async-handler');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'xzoxnco02983h4b2o3soj', {
    expiresIn: '30d',
  });
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    
    if (!user) {
      return res.status(400).json({ error: 'Google authentication failed' });
    }

    // Check if user already exists
    let existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: user.emails[0].value },
          { googleId: user.id }
        ]
      }
    });

    if (existingUser) {
      // Update Google ID if not set
      if (!existingUser.googleId) {
        await existingUser.update({ googleId: user.id });
      }
      
      // Update last login
      await existingUser.update({ lastLogin: new Date() });
      
      // Generate token
      const token = generateToken(existingUser.id);
      
      return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userType=${existingUser.userType}`);
    }

    // Create new user
    const newUser = await db.User.create({
      email: user.emails[0].value,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
      profileImage: user.photos[0]?.value,
      googleId: user.id,
      isEmailVerified: true, // Google emails are pre-verified
      userType: 'freelancer', // Default to freelancer, can be changed later
    });

    // Generate token
    const token = generateToken(newUser.id);
    
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userType=${newUser.userType}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`);
  }
});

// @desc    Facebook OAuth callback
// @route   GET /api/auth/facebook/callback
// @access  Public
const facebookCallback = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    
    if (!user) {
      return res.status(400).json({ error: 'Facebook authentication failed' });
    }

    // Check if user already exists
    let existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: user.emails[0].value },
          { facebookId: user.id }
        ]
      }
    });

    if (existingUser) {
      // Update Facebook ID if not set
      if (!existingUser.facebookId) {
        await existingUser.update({ facebookId: user.id });
      }
      
      // Update last login
      await existingUser.update({ lastLogin: new Date() });
      
      // Generate token
      const token = generateToken(existingUser.id);
      
      return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userType=${existingUser.userType}`);
    }

    // Create new user
    const newUser = await db.User.create({
      email: user.emails[0].value,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
      profileImage: user.photos[0]?.value,
      facebookId: user.id,
      isEmailVerified: true, // Facebook emails are pre-verified
      userType: 'freelancer', // Default to freelancer, can be changed later
    });

    // Generate token
    const token = generateToken(newUser.id);
    
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userType=${newUser.userType}`);
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`);
  }
});

// @desc    LinkedIn OAuth callback
// @route   GET /api/auth/linkedin/callback
// @access  Public
const linkedinCallback = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    
    if (!user) {
      return res.status(400).json({ error: 'LinkedIn authentication failed' });
    }

    // Check if user already exists
    let existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: user.emails[0].value },
          { linkedinId: user.id }
        ]
      }
    });

    if (existingUser) {
      // Update LinkedIn ID if not set
      if (!existingUser.linkedinId) {
        await existingUser.update({ linkedinId: user.id });
      }
      
      // Update last login
      await existingUser.update({ lastLogin: new Date() });
      
      // Generate token
      const token = generateToken(existingUser.id);
      
      return res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userType=${existingUser.userType}`);
    }

    // Create new user
    const newUser = await db.User.create({
      email: user.emails[0].value,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
      profileImage: user.photos[0]?.value,
      linkedinId: user.id,
      isEmailVerified: true, // LinkedIn emails are pre-verified
      userType: 'freelancer', // Default to freelancer, can be changed later
    });

    // Generate token
    const token = generateToken(newUser.id);
    
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&userType=${newUser.userType}`);
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/error?message=Authentication failed`);
  }
});

// @desc    Get OAuth user info
// @route   GET /api/auth/oauth/user
// @access  Private
const getOAuthUser = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.userId, {
    attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

module.exports = {
  googleCallback,
  facebookCallback,
  linkedinCallback,
  getOAuthUser,
};