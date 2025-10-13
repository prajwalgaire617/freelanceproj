const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db');
const { validationResult } = require('express-validator');

// Create JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'xzoxnco02983h4b2o3soj', {
    expiresIn: '30d',
  });
};

// Create email verification token
const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create password reset token
const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <h2>Welcome to WorkLab!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, userType } = req.body;

  // Check if user already exists
  const userExists = await db.User.findOne({ where: { email } });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Generate email verification token
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await db.User.create({
    email,
    password,
    firstName,
    lastName,
    userType,
    emailVerificationToken,
    emailVerificationExpires,
    connectBalance: 20, // Give 20 free connects on signup
  });

  // Create appropriate profile based on user type
  if (userType === 'freelancer') {
    await db.Freelancer.create({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      shortBio: 'New freelancer',
      yearsOfExperience: '0-1 years',
      expertise: 'General',
      userType: 'it',
      visibility: 'public'
    });
  } else if (userType === 'client') {
    await db.Organization.create({
      userId: user.id,
      name: `${firstName} ${lastName}`,
      email: user.email,
      organizationType: 'individual',
      size: '1-10',
      industry: 'Technology',
      website: '',
      description: 'New client organization'
    });
  }

  // Create connect record for the 20 free connects
  await db.Connect.create({
    userId: user.id,
    type: 'bonus',
    amount: 0, // Free connects
    quantity: 20,
    status: 'completed',
    remaining: 20,
    metadata: {
      description: 'Welcome bonus - 20 free connects for new users',
      source: 'signup_bonus'
    }
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, emailVerificationToken);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    message: 'User registered successfully. You received 20 free connects! Please check your email to verify your account.',
    token,
    user: {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      isEmailVerified: user.isEmailVerified,
      connectBalance: user.connectBalance,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if password is correct
  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({ error: 'Account is deactivated' });
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  // Generate token
  const token = generateToken(user.id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      isEmailVerified: user.isEmailVerified,
      profileImage: user.profileImage,
    },
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Verification token is required' });
  }

  // Find user with valid token
  const user = await db.User.findOne({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: {
        [db.Sequelize.Op.gt]: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired verification token' });
  }

  // Update user
  await user.update({
    isEmailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
  });

  res.json({ message: 'Email verified successfully' });
});

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({ error: 'Email already verified' });
  }

  // Generate new verification token
  const emailVerificationToken = generateEmailVerificationToken();
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.update({
    emailVerificationToken,
    emailVerificationExpires,
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, emailVerificationToken);
    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Generate password reset token
  const passwordResetToken = generatePasswordResetToken();
  const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.update({
    passwordResetToken,
    passwordResetExpires,
  });

  // Send password reset email
  try {
    await sendPasswordResetEmail(email, passwordResetToken);
    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and password are required' });
  }

  // Find user with valid token
  const user = await db.User.findOne({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        [db.Sequelize.Op.gt]: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset token' });
  }

  // Update password
  await user.update({
    password,
    passwordResetToken: null,
    passwordResetExpires: null,
  });

  res.json({ message: 'Password reset successfully' });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.userId, {
    attributes: { exclude: ['password', 'emailVerificationToken', 'passwordResetToken'] },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, timezone, language, emailNotifications, pushNotifications } = req.body;

  const user = await db.User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await user.update({
    firstName,
    lastName,
    timezone,
    language,
    emailNotifications,
    pushNotifications,
  });

  res.json({ message: 'Profile updated successfully', user });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await db.User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check current password
  const isCurrentPasswordCorrect = await user.checkPassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }

  // Update password
  await user.update({ password: newPassword });

  res.json({ message: 'Password changed successfully' });
});

// @desc    Deactivate account
// @route   DELETE /api/auth/deactivate
// @access  Private
const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await db.User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await user.update({ isActive: false });

  res.json({ message: 'Account deactivated successfully' });
});

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  deactivateAccount,
};