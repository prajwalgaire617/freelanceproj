const asyncHandler = require('express-async-handler');
const db = require('../db/models/index.js');
const { validationResult } = require('express-validator');

// @desc    Create agency profile
// @route   POST /api/agencies
// @access  Private
const createAgencyProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    agencyName,
    description,
    website,
    phone,
    address,
    city,
    country,
    businessType,
    taxId,
    specializations,
    teamSize,
    yearsInBusiness
  } = req.body;

  const userId = req.userId;

  // Check if user already has an agency
  const existingAgency = await db.Agency.findOne({ where: { userId } });
  if (existingAgency) {
    return res.status(400).json({ error: 'User already has an agency profile' });
  }

  // Create agency
  const agency = await db.Agency.create({
    userId,
    agencyName,
    description,
    website,
    phone,
    address,
    city,
    country,
    businessType,
    taxId,
    specializations,
    teamSize,
    yearsInBusiness
  });

  // Get agency with user details
  const agencyWithDetails = await db.Agency.findByPk(agency.id, {
    include: [{ model: db.User, as: 'user' }]
  });

  res.status(201).json({
    message: 'Agency profile created successfully',
    agency: agencyWithDetails
  });
});

// @desc    Get agency profile
// @route   GET /api/agencies/profile
// @access  Private
const getAgencyProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const agency = await db.Agency.findOne({
    where: { userId },
    include: [{ model: db.User, as: 'user' }]
  });

  if (!agency) {
    return res.status(404).json({ error: 'Agency profile not found' });
  }

  res.json({ agency });
});

// @desc    Update agency profile
// @route   PUT /api/agencies/profile
// @access  Private
const updateAgencyProfile = asyncHandler(async (req, res) => {
  const {
    agencyName,
    description,
    website,
    phone,
    address,
    city,
    country,
    businessType,
    taxId,
    specializations,
    teamSize,
    yearsInBusiness
  } = req.body;

  const userId = req.userId;

  const agency = await db.Agency.findOne({ where: { userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency profile not found' });
  }

  // Update agency
  await agency.update({
    agencyName,
    description,
    website,
    phone,
    address,
    city,
    country,
    businessType,
    taxId,
    specializations,
    teamSize,
    yearsInBusiness
  });

  res.json({
    message: 'Agency profile updated successfully',
    agency
  });
});

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Public
const getAgencies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, specialization, location } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let whereClause = { isActive: true };

  if (search) {
    whereClause[db.Sequelize.Op.or] = [
      { agencyName: { [db.Sequelize.Op.like]: `%${search}%` } },
      { description: { [db.Sequelize.Op.like]: `%${search}%` } }
    ];
  }

  if (specialization) {
    whereClause.specializations = {
      [db.Sequelize.Op.contains]: [specialization]
    };
  }

  if (location) {
    whereClause[db.Sequelize.Op.or] = [
      { city: { [db.Sequelize.Op.like]: `%${location}%` } },
      { country: { [db.Sequelize.Op.like]: `%${location}%` } }
    ];
  }

  const agencies = await db.Agency.findAndCountAll({
    where: whereClause,
    include: [{ model: db.User, as: 'user' }],
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    agencies: agencies.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(agencies.count / parseInt(limit)),
      totalAgencies: agencies.count,
      agenciesPerPage: parseInt(limit)
    }
  });
});

// @desc    Get agency details
// @route   GET /api/agencies/:agencyId
// @access  Public
const getAgencyDetails = asyncHandler(async (req, res) => {
  const { agencyId } = req.params;

  const agency = await db.Agency.findByPk(agencyId, {
    include: [
      { model: db.User, as: 'user' },
      { model: db.AgencyFreelancer, as: 'freelancers', include: [{ model: db.Freelancer, as: 'freelancer' }] }
    ]
  });

  if (!agency) {
    return res.status(404).json({ error: 'Agency not found' });
  }

  res.json({ agency });
});

// @desc    Add freelancer to agency
// @route   POST /api/agencies/:agencyId/freelancers
// @access  Private
const addFreelancerToAgency = asyncHandler(async (req, res) => {
  const { agencyId } = req.params;
  const { freelancerId, role, commissionRate } = req.body;
  const userId = req.userId;

  // Check if user owns the agency
  const agency = await db.Agency.findOne({ where: { id: agencyId, userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency not found or not authorized' });
  }

  // Check if freelancer exists
  const freelancer = await db.Freelancer.findByPk(freelancerId);
  if (!freelancer) {
    return res.status(404).json({ error: 'Freelancer not found' });
  }

  // Check if freelancer is already in agency
  const existingRelationship = await db.AgencyFreelancer.findOne({
    where: { agencyId, freelancerId }
  });

  if (existingRelationship) {
    return res.status(400).json({ error: 'Freelancer is already in this agency' });
  }

  // Create agency-freelancer relationship
  const agencyFreelancer = await db.AgencyFreelancer.create({
    agencyId,
    freelancerId,
    role,
    commissionRate,
    status: 'pending'
  });

  res.status(201).json({
    message: 'Freelancer added to agency successfully',
    relationship: agencyFreelancer
  });
});

// @desc    Get agency freelancers
// @route   GET /api/agencies/:agencyId/freelancers
// @access  Private
const getAgencyFreelancers = asyncHandler(async (req, res) => {
  const { agencyId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Check if user owns the agency
  const agency = await db.Agency.findOne({ where: { id: agencyId, userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency not found or not authorized' });
  }

  const whereClause = { agencyId };
  if (status) {
    whereClause.status = status;
  }

  const relationships = await db.AgencyFreelancer.findAndCountAll({
    where: whereClause,
    include: [
      { model: db.Freelancer, as: 'freelancer', include: [{ model: db.User, as: 'user' }] }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    freelancers: relationships.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(relationships.count / parseInt(limit)),
      totalFreelancers: relationships.count,
      freelancersPerPage: parseInt(limit)
    }
  });
});

// @desc    Update freelancer status in agency
// @route   PUT /api/agencies/:agencyId/freelancers/:freelancerId
// @access  Private
const updateFreelancerStatus = asyncHandler(async (req, res) => {
  const { agencyId, freelancerId } = req.params;
  const { status, role, commissionRate } = req.body;
  const userId = req.userId;

  // Check if user owns the agency
  const agency = await db.Agency.findOne({ where: { id: agencyId, userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency not found or not authorized' });
  }

  const relationship = await db.AgencyFreelancer.findOne({
    where: { agencyId, freelancerId }
  });

  if (!relationship) {
    return res.status(404).json({ error: 'Freelancer not found in agency' });
  }

  // Update relationship
  await relationship.update({
    status,
    role,
    commissionRate
  });

  res.json({
    message: 'Freelancer status updated successfully',
    relationship
  });
});

// @desc    Remove freelancer from agency
// @route   DELETE /api/agencies/:agencyId/freelancers/:freelancerId
// @access  Private
const removeFreelancerFromAgency = asyncHandler(async (req, res) => {
  const { agencyId, freelancerId } = req.params;
  const userId = req.userId;

  // Check if user owns the agency
  const agency = await db.Agency.findOne({ where: { id: agencyId, userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency not found or not authorized' });
  }

  const relationship = await db.AgencyFreelancer.findOne({
    where: { agencyId, freelancerId }
  });

  if (!relationship) {
    return res.status(404).json({ error: 'Freelancer not found in agency' });
  }

  // Remove relationship
  await relationship.destroy();

  res.json({ message: 'Freelancer removed from agency successfully' });
});

// @desc    Get agency jobs
// @route   GET /api/agencies/:agencyId/jobs
// @access  Private
const getAgencyJobs = asyncHandler(async (req, res) => {
  const { agencyId } = req.params;
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  // Check if user owns the agency
  const agency = await db.Agency.findOne({ where: { id: agencyId, userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency not found or not authorized' });
  }

  // Get freelancers in agency
  const freelancerRelationships = await db.AgencyFreelancer.findAll({
    where: { agencyId, status: 'active' }
  });

  const freelancerIds = freelancerRelationships.map(rel => rel.freelancerId);

  // Get job applications by agency freelancers
  const whereClause = {
    userId: { [db.Sequelize.Op.in]: freelancerIds }
  };

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

// @desc    Get agency statistics
// @route   GET /api/agencies/:agencyId/statistics
// @access  Private
const getAgencyStatistics = asyncHandler(async (req, res) => {
  const { agencyId } = req.params;
  const userId = req.userId;

  // Check if user owns the agency
  const agency = await db.Agency.findOne({ where: { id: agencyId, userId } });
  if (!agency) {
    return res.status(404).json({ error: 'Agency not found or not authorized' });
  }

  // Get freelancers in agency
  const freelancerRelationships = await db.AgencyFreelancer.findAll({
    where: { agencyId, status: 'active' }
  });

  const freelancerIds = freelancerRelationships.map(rel => rel.freelancerId);

  // Get statistics
  const totalFreelancers = freelancerRelationships.length;
  const totalApplications = await db.JobApplication.count({
    where: { userId: { [db.Sequelize.Op.in]: freelancerIds } }
  });
  const acceptedApplications = await db.JobApplication.count({
    where: { 
      userId: { [db.Sequelize.Op.in]: freelancerIds },
      status: 'accepted'
    }
  });
  const totalContracts = await db.Contract.count({
    where: { freelancerId: { [db.Sequelize.Op.in]: freelancerIds } }
  });

  res.json({
    totalFreelancers,
    totalApplications,
    acceptedApplications,
    totalContracts,
    successRate: totalApplications > 0 ? (acceptedApplications / totalApplications * 100).toFixed(2) : 0
  });
});

module.exports = {
  createAgencyProfile,
  getAgencyProfile,
  updateAgencyProfile,
  getAgencies,
  getAgencyDetails,
  addFreelancerToAgency,
  getAgencyFreelancers,
  updateFreelancerStatus,
  removeFreelancerFromAgency,
  getAgencyJobs,
  getAgencyStatistics,
};