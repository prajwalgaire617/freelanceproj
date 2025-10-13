const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/response');
const asyncHandler = require('express-async-handler');

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleCallback = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'worklab_jwt_secret_2024_secure_key',
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}&provider=google`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
});

// @desc    Apple OAuth callback
// @route   GET /api/auth/apple/callback
// @access  Public
const appleCallback = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'worklab_jwt_secret_2024_secure_key',
      { expiresIn: '24h' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback?token=${token}&provider=apple`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Apple OAuth Callback Error:', error);
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
});

// @desc    Get OAuth URLs
// @route   GET /api/auth/oauth-urls
// @access  Public
const getOAuthUrls = asyncHandler(async (req, res) => {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  
  const urls = {
    google: `${baseUrl}/api/auth/google`,
    apple: `${baseUrl}/api/auth/apple`
  };

  // Check which OAuth providers are configured
  const configured = {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    apple: !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY)
  };

  sendSuccess(res, {
    urls,
    configured,
    message: 'OAuth URLs retrieved successfully. Configure environment variables to enable OAuth providers.'
  }, 'OAuth URLs retrieved successfully');
});

module.exports = {
  googleCallback,
  appleCallback,
  getOAuthUrls
};