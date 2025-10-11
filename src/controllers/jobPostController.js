const { JobPost, User, JobApplication, Freelancer, sequelize } = require('../db');
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');

/**
 * @swagger
 * components:
 *   schemas:
 *     JobPostUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Updated Job Title"
 *         description:
 *           type: string
 *           example: "Updated job description..."
 *         budget:
 *           type: number
 *           example: 2000
 *         status:
 *           type: string
 *           enum: [draft, active, paused, closed, completed]
 *           example: "active"
 *         isUrgent:
 *           type: boolean
 *           example: true
 *         isFeatured:
 *           type: boolean
 *           example: false
 */

// @desc    Get all public job posts
// @route   GET /api/jobs
// @access  Public
const getAllJobs = asyncHandler(async (req, res) => {
  const {
    search,
    skills = [],
    budgetMin,
    budgetMax,
    jobType,
    experienceLevel,
    page = 1,
    limit = 10
  } = req.query;

  const offset = (page - 1) * limit;
  const whereClause = {
    status: 'active',
    isPublic: true
  };

  // Search functionality
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  // Filter by skills
  if (skills.length > 0) {
    whereClause.skills = {
      [Op.contains]: skills
    };
  }

  // Filter by budget
  if (budgetMin || budgetMax) {
    whereClause.budget = {};
    if (budgetMin) whereClause.budget[Op.gte] = budgetMin;
    if (budgetMax) whereClause.budget[Op.lte] = budgetMax;
  }

  // Filter by job type
  if (jobType) {
    whereClause.budgetType = jobType;
  }

  // Filter by experience level
  if (experienceLevel) {
    whereClause.experienceLevel = experienceLevel;
  }

  const { count, rows: jobs } = await JobPost.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'client',
        attributes: ['id', 'firstName', 'lastName', 'profileImage']
      }
    ],
    order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
    distinct: true, // Ensure accurate count with joins
    subQuery: false // Optimize for better performance with includes
  });

  const totalPages = Math.ceil(count / limit);

  res.json({
    success: true,
    jobs,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalJobs: count,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// @desc    Get single job post
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await JobPost.findByPk(id, {
    include: [
      {
        model: User,
        as: 'client',
        attributes: ['id', 'firstName', 'lastName', 'profileImage', 'email']
      }
    ]
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }

  res.json({
    success: true,
    job
  });
});

// @desc    Update job post
// @route   PUT /api/jobs/:id
// @access  Private (Client)
const updateJobPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;
  const updateData = req.body;

  const job = await JobPost.findOne({
    where: { id, clientId }
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found or access denied'
    });
  }

  await job.update(updateData);

  res.json({
    success: true,
    message: 'Job updated successfully',
    job
  });
});

// @desc    Delete job post
// @route   DELETE /api/jobs/:id
// @access  Private (Client)
const deleteJobPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;

  const job = await JobPost.findOne({
    where: { id, clientId }
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found or access denied'
    });
  }

  await job.destroy();

  res.json({
    success: true,
    message: 'Job deleted successfully'
  });
});

// @desc    Get job statistics
// @route   GET /api/jobs/:id/stats
// @access  Private (Client)
const getJobStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;

  const job = await JobPost.findOne({
    where: { id, clientId }
  });

  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found or access denied'
    });
  }

  const totalApplications = await JobApplication.count({
    where: { jobPostId: id }
  });

  const applicationsByStatus = await JobApplication.findAll({
    where: { jobPostId: id },
    attributes: ['status'],
    group: ['status'],
    raw: true
  });

  const statusCounts = applicationsByStatus.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    stats: {
      totalApplications,
      statusCounts,
      jobViews: job.views || 0
    }
  });
});

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const jobs = await JobPost.findAll({
    where: {
      status: 'active',
      isPublic: true,
      isFeatured: true
    },
    include: [
      {
        model: User,
        as: 'client',
        attributes: ['id', 'firstName', 'lastName', 'profileImage']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    jobs
  });
});

// @desc    Get urgent jobs
// @route   GET /api/jobs/urgent
// @access  Public
const getUrgentJobs = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const jobs = await JobPost.findAll({
    where: {
      status: 'active',
      isPublic: true,
      isUrgent: true
    },
    include: [
      {
        model: User,
        as: 'client',
        attributes: ['id', 'firstName', 'lastName', 'profileImage']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    jobs
  });
});

module.exports = {
  getAllJobs,
  getJobById,
  updateJobPost,
  deleteJobPost,
  getJobStats,
  getFeaturedJobs,
  getUrgentJobs
};