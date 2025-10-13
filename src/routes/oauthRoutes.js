const express = require('express');
const passport = require('passport');
const router = express.Router();

const oauthController = require('../controllers/oauthController');

// @route   GET /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google', (req, res, next) => {
  try {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ 
        success: false,
        error: 'Google OAuth not configured',
        message: 'Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!passport._strategy('google')) {
      return res.status(501).json({ 
        success: false,
        error: 'Google OAuth strategy not loaded',
        message: 'Google OAuth strategy failed to load. Please check your configuration.',
        timestamp: new Date().toISOString()
      });
    }
    
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'OAuth service unavailable',
      message: 'OAuth service is temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', (req, res, next) => {
  try {
    if (!passport._strategy('google')) {
      return res.status(501).json({ 
        success: false,
        error: 'Google OAuth not configured',
        message: 'Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables',
        timestamp: new Date().toISOString()
      });
    }
    passport.authenticate('google', { session: false })(req, res, next);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({ 
      success: false,
      error: 'OAuth service unavailable',
      message: 'OAuth service is temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
}, oauthController.googleCallback);

// @route   GET /api/auth/apple
// @desc    Apple OAuth login
// @access  Public
router.get('/apple', (req, res, next) => {
  try {
    // Check if Apple OAuth is configured
    if (!process.env.APPLE_CLIENT_ID || !process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID || !process.env.APPLE_PRIVATE_KEY) {
      return res.status(501).json({ 
        success: false,
        error: 'Apple OAuth not configured',
        message: 'Please configure Apple OAuth credentials in your environment variables',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!passport._strategy('apple')) {
      return res.status(501).json({ 
        success: false,
        error: 'Apple OAuth strategy not loaded',
        message: 'Apple OAuth strategy failed to load. Please check your configuration.',
        timestamp: new Date().toISOString()
      });
    }
    
    passport.authenticate('apple', {
      scope: ['name', 'email']
    })(req, res, next);
  } catch (error) {
    console.error('Apple OAuth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'OAuth service unavailable',
      message: 'OAuth service is temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

// @route   GET /api/auth/apple/callback
// @desc    Apple OAuth callback
// @access  Public
router.get('/apple/callback', (req, res, next) => {
  try {
    if (!passport._strategy('apple')) {
      return res.status(501).json({ 
        success: false,
        error: 'Apple OAuth not configured',
        message: 'Please configure Apple OAuth credentials in your environment variables',
        timestamp: new Date().toISOString()
      });
    }
    passport.authenticate('apple', { session: false })(req, res, next);
  } catch (error) {
    console.error('Apple OAuth callback error:', error);
    res.status(500).json({ 
      success: false,
      error: 'OAuth service unavailable',
      message: 'OAuth service is temporarily unavailable',
      timestamp: new Date().toISOString()
    });
  }
}, oauthController.appleCallback);

// @route   GET /api/auth/oauth-urls
// @desc    Get OAuth URLs for frontend
// @access  Public
router.get('/oauth-urls', oauthController.getOAuthUrls);

module.exports = router;
