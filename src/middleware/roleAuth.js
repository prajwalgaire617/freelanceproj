const { User, Freelancer, Agency } = require('../db/models');
const asyncHandler = require('express-async-handler');

/**
 * Middleware to check if user has a specific role
 * @param {string} role - The required role (freelancer, client, agency)
 */
const requireRole = (role) => {
  return asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const userType = req.user.userType;

    // Check if user has the correct userType
    if (userType !== role) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This endpoint requires ${role} role.`
      });
    }

    // For freelancer and agency, check if profile exists
    if (role === 'freelancer') {
      const freelancer = await Freelancer.findOne({ where: { userId } });
      if (!freelancer) {
        return res.status(404).json({
          success: false,
          message: 'Freelancer profile not found. Please complete your profile setup.'
        });
      }
      req.user.freelancerId = freelancer.id;
    }

    if (role === 'agency') {
      const agency = await Agency.findOne({ where: { userId } });
      if (!agency) {
        return res.status(404).json({
          success: false,
          message: 'Agency profile not found. Please complete your profile setup.'
        });
      }
      req.user.agencyId = agency.id;
    }

    next();
  });
};

/**
 * Middleware to check if user has any of the specified roles
 * @param {string[]} roles - Array of allowed roles
 */
const requireAnyRole = (roles) => {
  return asyncHandler(async (req, res, next) => {
    const userType = req.user.userType;

    if (!roles.includes(userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This endpoint requires one of: ${roles.join(', ')}`
      });
    }

    // Set appropriate ID based on role
    const userId = req.user.id;
    if (userType === 'freelancer') {
      const freelancer = await Freelancer.findOne({ where: { userId } });
      if (freelancer) {
        req.user.freelancerId = freelancer.id;
      }
    }

    if (userType === 'agency') {
      const agency = await Agency.findOne({ where: { userId } });
      if (agency) {
        req.user.agencyId = agency.id;
      }
    }

    next();
  });
};

/**
 * Middleware to check if user can access a specific resource
 * @param {string} resourceType - Type of resource (job, application, contract, etc.)
 */
const canAccessResource = (resourceType) => {
  return asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const userType = req.user.userType;
    const resourceId = req.params.id || req.params.jobId || req.params.applicationId || req.params.contractId;

    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: 'Resource ID is required'
      });
    }

    let hasAccess = false;

    switch (resourceType) {
      case 'job':
        const job = await JobPost.findByPk(resourceId);
        if (job) {
          hasAccess = job.clientId === userId || userType === 'freelancer' || userType === 'agency';
        }
        break;

      case 'application':
        const application = await JobApplication.findByPk(resourceId, {
          include: [
            { model: JobPost, as: 'jobPost' },
            { model: Freelancer, as: 'freelancer' }
          ]
        });
        if (application) {
          hasAccess = 
            application.jobPost.clientId === userId || // Client owns the job
            application.freelancer.userId === userId || // Freelancer owns the application
            userType === 'agency'; // Agency can access
        }
        break;

      case 'contract':
        const contract = await Contract.findByPk(resourceId);
        if (contract) {
          hasAccess = 
            contract.clientId === userId || // Client owns the contract
            contract.freelancerId === userId || // Freelancer is part of contract
            contract.agencyId === userId; // Agency owns the contract
        }
        break;

      default:
        hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this resource.'
      });
    }

    next();
  });
};

module.exports = {
  requireRole,
  requireAnyRole,
  canAccessResource
};
