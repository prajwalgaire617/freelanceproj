const asyncHandler = require('express-async-handler');
const db = require('../db/models/index.js');
const { validationResult } = require('express-validator');

// @desc    Apply for a job
// @route   POST /api/job-applications
// @access  Private
const applyForJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { jobPostId, coverLetter, proposedRate, proposedTimeline, additionalInfo, attachments } = req.body;
  const userId = req.userId;

  // Check if job post exists and is active
  const jobPost = await db.JobPost.findByPk(jobPostId, {
    include: [
      { model: db.User, as: 'client' },
      { model: db.Organization, as: 'organization' }
    ]
  });

  if (!jobPost) {
    return res.status(404).json({ error: 'Job post not found' });
  }

  if (jobPost.status !== 'active') {
    return res.status(400).json({ error: 'Job post is not active' });
  }

  // Check if application deadline has passed
  if (jobPost.applicationDeadline && new Date() > jobPost.applicationDeadline) {
    return res.status(400).json({ error: 'Application deadline has passed' });
  }

  // Check if user has already applied
  const existingApplication = await db.JobApplication.findOne({
    where: { userId, jobPostId }
  });

  if (existingApplication) {
    return res.status(400).json({ error: 'You have already applied for this job' });
  }

  // Check if user has enough connects
  if (jobPost.connectRequired > 0) {
    const user = await db.User.findByPk(userId);
    if (user.connectBalance < jobPost.connectRequired) {
      return res.status(400).json({ 
        error: 'Insufficient connects', 
        required: jobPost.connectRequired,
        available: user.connectBalance 
      });
    }
  }

  // Create job application
  const jobApplication = await db.JobApplication.create({
    userId,
    jobPostId,
    coverLetter,
    proposedRate,
    proposedTimeline,
    additionalInfo,
    attachments,
    status: 'pending'
  });

  // Deduct connects if required
  if (jobPost.connectRequired > 0) {
    const user = await db.User.findByPk(userId);
    await user.update({
      connectBalance: user.connectBalance - jobPost.connectRequired
    });

    // Create connect usage record
    await db.Connect.create({
      userId,
      type: 'used',
      amount: 0,
      quantity: jobPost.connectRequired,
      status: 'completed',
      used: jobPost.connectRequired,
      remaining: 0,
      metadata: { jobApplicationId: jobApplication.id }
    });
  }

  // Get application with relations
  const applicationWithDetails = await db.JobApplication.findByPk(jobApplication.id, {
    include: [
      { model: db.User, as: 'applicant' },
      { model: db.JobPost, as: 'jobPost' }
    ]
  });

  res.status(201).json({
    message: 'Job application submitted successfully',
    application: applicationWithDetails
  });
});

// @desc    Get user's job applications
// @route   GET /api/job-applications/my-applications
// @access  Private
const getMyApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = { userId };
  if (status) {
    whereClause.status = status;
  }

  const applications = await db.JobApplication.findAndCountAll({
    where: whereClause,
    include: [
      { model: db.JobPost, as: 'jobPost' },
      { model: db.User, as: 'applicant' }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['appliedAt', 'DESC']]
  });

  res.json({
    applications: applications.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(applications.count / parseInt(limit)),
      totalApplications: applications.count,
      applicationsPerPage: parseInt(limit)
    }
  });
});

// @desc    Get job applications for a job post
// @route   GET /api/job-applications/job/:jobPostId
// @access  Private
const getJobApplications = asyncHandler(async (req, res) => {
  const { jobPostId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Check if user owns the job post
  const jobPost = await db.JobPost.findByPk(jobPostId);
  if (!jobPost) {
    return res.status(404).json({ error: 'Job post not found' });
  }

  if (jobPost.clientId !== userId) {
    return res.status(403).json({ error: 'Not authorized to view these applications' });
  }

  const whereClause = { jobPostId };
  if (status) {
    whereClause.status = status;
  }

  const applications = await db.JobApplication.findAndCountAll({
    where: whereClause,
    include: [
      { model: db.User, as: 'applicant' },
      { model: db.JobPost, as: 'jobPost' }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['appliedAt', 'DESC']]
  });

  res.json({
    applications: applications.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(applications.count / parseInt(limit)),
      totalApplications: applications.count,
      applicationsPerPage: parseInt(limit)
    }
  });
});

// @desc    Update application status
// @route   PUT /api/job-applications/:applicationId/status
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status, clientFeedback, clientRating } = req.body;
  const userId = req.userId;

  const application = await db.JobApplication.findByPk(applicationId, {
    include: [{ model: db.JobPost, as: 'jobPost' }]
  });

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Check if user owns the job post
  if (application.jobPost.clientId !== userId) {
    return res.status(403).json({ error: 'Not authorized to update this application' });
  }

  // Update application
  await application.update({
    status,
    clientFeedback,
    clientRating,
    reviewedAt: new Date(),
    respondedAt: new Date()
  });

  res.json({
    message: 'Application status updated successfully',
    application
  });
});

// @desc    Withdraw application
// @route   PUT /api/job-applications/:applicationId/withdraw
// @access  Private
const withdrawApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const userId = req.userId;

  const application = await db.JobApplication.findByPk(applicationId);

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (application.userId !== userId) {
    return res.status(403).json({ error: 'Not authorized to withdraw this application' });
  }

  if (application.status !== 'pending') {
    return res.status(400).json({ error: 'Cannot withdraw application in current status' });
  }

  // Update application status
  await application.update({
    status: 'withdrawn',
    respondedAt: new Date()
  });

  res.json({
    message: 'Application withdrawn successfully',
    application
  });
});

// @desc    Get application details
// @route   GET /api/job-applications/:applicationId
// @access  Private
const getApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const userId = req.userId;

  const application = await db.JobApplication.findByPk(applicationId, {
    include: [
      { model: db.User, as: 'applicant' },
      { model: db.JobPost, as: 'jobPost' }
    ]
  });

  if (!application) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Check if user is authorized to view this application
  if (application.userId !== userId && application.jobPost.clientId !== userId) {
    return res.status(403).json({ error: 'Not authorized to view this application' });
  }

  res.json({ application });
});

// @desc    Get application statistics
// @route   GET /api/job-applications/statistics
// @access  Private
const getApplicationStatistics = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const userType = req.userType;

  let statistics = {};

  if (userType === 'freelancer') {
    // Freelancer statistics
    const totalApplications = await db.JobApplication.count({ where: { userId } });
    const pendingApplications = await db.JobApplication.count({ 
      where: { userId, status: 'pending' } 
    });
    const acceptedApplications = await db.JobApplication.count({ 
      where: { userId, status: 'accepted' } 
    });
    const rejectedApplications = await db.JobApplication.count({ 
      where: { userId, status: 'rejected' } 
    });

    statistics = {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      acceptanceRate: totalApplications > 0 ? (acceptedApplications / totalApplications * 100).toFixed(2) : 0
    };
  } else if (userType === 'client') {
    // Client statistics
    const jobPosts = await db.JobPost.findAll({ where: { clientId: userId } });
    const jobPostIds = jobPosts.map(job => job.id);

    const totalApplications = await db.JobApplication.count({ 
      where: { jobPostId: { [db.Sequelize.Op.in]: jobPostIds } } 
    });
    const pendingApplications = await db.JobApplication.count({ 
      where: { jobPostId: { [db.Sequelize.Op.in]: jobPostIds }, status: 'pending' } 
    });
    const acceptedApplications = await db.JobApplication.count({ 
      where: { jobPostId: { [db.Sequelize.Op.in]: jobPostIds }, status: 'accepted' } 
    });

    statistics = {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      totalJobPosts: jobPosts.length
    };
  }

  res.json({ statistics });
});

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationDetails,
  getApplicationStatistics,
};