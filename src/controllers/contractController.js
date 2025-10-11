const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db');
const { validationResult } = require('express-validator');

// @desc    Create contract
// @route   POST /api/contracts
// @access  Private
const createContract = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    freelancerId,
    jobApplicationId,
    workTitle,
    workDescription,
    deliverables,
    milestones,
    totalAmount,
    hourlyRate,
    paymentSchedule,
    contractStartDate,
    contractEndDate
  } = req.body;

  const clientId = req.userId;

  // Check if freelancer exists
  const freelancer = await db.Freelancer.findByPk(freelancerId, {
    include: [{ model: db.User, as: 'user' }]
  });

  if (!freelancer) {
    return res.status(404).json({ error: 'Freelancer not found' });
  }

  // Check if job application exists (if provided)
  if (jobApplicationId) {
    const jobApplication = await db.JobApplication.findByPk(jobApplicationId);
    if (!jobApplication) {
      return res.status(404).json({ error: 'Job application not found' });
    }
  }

  // Create contract
  const contract = await db.Contract.create({
    clientId,
    freelancerId,
    jobApplicationId,
    workTitle,
    workDescription,
    deliverables,
    milestones,
    totalAmount,
    hourlyRate,
    paymentSchedule,
    contractStartDate,
    contractEndDate,
    contractStatus: 'draft',
    status: 'active'
  });

  // Get contract with relations
  const contractWithDetails = await db.Contract.findByPk(contract.id, {
    include: [
      { model: db.User, as: 'client' },
      { model: db.Freelancer, as: 'freelancer', include: [{ model: db.User, as: 'user' }] },
      { model: db.JobApplication, as: 'jobApplication' }
    ]
  });

  res.status(201).json({
    message: 'Contract created successfully',
    contract: contractWithDetails
  });
});

// @desc    Get user's contracts
// @route   GET /api/contracts
// @access  Private
const getContracts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, role } = req.query;
  const userId = req.userId;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let whereClause = {};
  
  if (role === 'client') {
    whereClause.clientId = userId;
  } else if (role === 'freelancer') {
    whereClause.freelancerId = userId;
  } else {
    whereClause = {
      [db.Sequelize.Op.or]: [
        { clientId: userId },
        { freelancerId: userId }
      ]
    };
  }

  if (status) {
    whereClause.contractStatus = status;
  }

  const contracts = await db.Contract.findAndCountAll({
    where: whereClause,
    include: [
      { model: db.User, as: 'client' },
      { model: db.Freelancer, as: 'freelancer', include: [{ model: db.User, as: 'user' }] },
      { model: db.JobApplication, as: 'jobApplication' }
    ],
    limit: parseInt(limit),
    offset: offset,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    contracts: contracts.rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(contracts.count / parseInt(limit)),
      totalContracts: contracts.count,
      contractsPerPage: parseInt(limit)
    }
  });
});

// @desc    Get contract details
// @route   GET /api/contracts/:contractId
// @access  Private
const getContractDetails = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId, {
    include: [
      { model: db.User, as: 'client' },
      { model: db.Freelancer, as: 'freelancer', include: [{ model: db.User, as: 'user' }] },
      { model: db.JobApplication, as: 'jobApplication' },
      { model: db.Message, as: 'messages' }
    ]
  });

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is authorized to view this contract
  if (contract.clientId !== userId && contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to view this contract' });
  }

  res.json({ contract });
});

// @desc    Accept contract
// @route   PUT /api/contracts/:contractId/accept
// @access  Private
const acceptContract = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is the freelancer
  if (contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to accept this contract' });
  }

  if (contract.contractStatus !== 'pending') {
    return res.status(400).json({ error: 'Contract cannot be accepted in current status' });
  }

  // Update contract status
  await contract.update({
    contractStatus: 'active',
    signedAt: new Date()
  });

  res.json({
    message: 'Contract accepted successfully',
    contract
  });
});

// @desc    Request payment
// @route   POST /api/contracts/:contractId/request-payment
// @access  Private
const requestPayment = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { amount, description, workCompleted } = req.body;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is the freelancer
  if (contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to request payment for this contract' });
  }

  if (contract.contractStatus !== 'active') {
    return res.status(400).json({ error: 'Contract must be active to request payment' });
  }

  // Create payment request
  const paymentRequest = await db.PaymentRequest.create({
    contractId,
    freelancerId: userId,
    amount,
    description,
    workCompleted,
    status: 'pending'
  });

  res.json({
    message: 'Payment request submitted successfully',
    paymentRequest
  });
});

// @desc    Release payment
// @route   POST /api/contracts/:contractId/release-payment
// @access  Private
const releasePayment = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { amount, paymentMethodId } = req.body;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId, {
    include: [
      { model: db.Freelancer, as: 'freelancer', include: [{ model: db.User, as: 'user' }] }
    ]
  });

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is the client
  if (contract.clientId !== userId) {
    return res.status(403).json({ error: 'Not authorized to release payment for this contract' });
  }

  if (contract.contractStatus !== 'active') {
    return res.status(400).json({ error: 'Contract must be active to release payment' });
  }

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.CLIENT_URL}/contracts/${contractId}/payment-success`,
      metadata: {
        contractId: contractId.toString(),
        freelancerId: contract.freelancerId.toString(),
        type: 'contract_payment'
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update contract
      await contract.update({
        paymentReleased: true,
        paymentReleaseDate: new Date(),
        stripePaymentIntentId: paymentIntent.id
      });

      res.json({
        message: 'Payment released successfully',
        paymentIntentId: paymentIntent.id
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// @desc    Mark work as completed
// @route   PUT /api/contracts/:contractId/complete-work
// @access  Private
const completeWork = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { completionNotes } = req.body;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is the freelancer
  if (contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to complete work for this contract' });
  }

  if (contract.contractStatus !== 'active') {
    return res.status(400).json({ error: 'Contract must be active to complete work' });
  }

  // Update contract
  await contract.update({
    workCompleted: true,
    completionDate: new Date(),
    contractStatus: 'completed'
  });

  res.json({
    message: 'Work marked as completed successfully',
    contract
  });
});

// @desc    Dispute contract
// @route   POST /api/contracts/:contractId/dispute
// @access  Private
const disputeContract = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { disputeReason } = req.body;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is authorized to dispute this contract
  if (contract.clientId !== userId && contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to dispute this contract' });
  }

  if (contract.contractStatus === 'disputed') {
    return res.status(400).json({ error: 'Contract is already in dispute' });
  }

  // Update contract
  await contract.update({
    contractStatus: 'disputed',
    disputeReason
  });

  res.json({
    message: 'Contract dispute submitted successfully',
    contract
  });
});

// @desc    Resolve dispute
// @route   PUT /api/contracts/:contractId/resolve-dispute
// @access  Private
const resolveDispute = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  const { disputeResolution, newStatus } = req.body;
  const userId = req.userId;

  const contract = await db.Contract.findByPk(contractId);

  if (!contract) {
    return res.status(404).json({ error: 'Contract not found' });
  }

  // Check if user is authorized to resolve this dispute
  if (contract.clientId !== userId && contract.freelancerId !== userId) {
    return res.status(403).json({ error: 'Not authorized to resolve this dispute' });
  }

  if (contract.contractStatus !== 'disputed') {
    return res.status(400).json({ error: 'Contract is not in dispute' });
  }

  // Update contract
  await contract.update({
    contractStatus: newStatus,
    disputeResolution
  });

  res.json({
    message: 'Dispute resolved successfully',
    contract
  });
});

// @desc    Get contract statistics
// @route   GET /api/contracts/statistics
// @access  Private
const getContractStatistics = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const userType = req.userType;

  let statistics = {};

  if (userType === 'freelancer') {
    const totalContracts = await db.Contract.count({ where: { freelancerId: userId } });
    const activeContracts = await db.Contract.count({ 
      where: { freelancerId: userId, contractStatus: 'active' } 
    });
    const completedContracts = await db.Contract.count({ 
      where: { freelancerId: userId, contractStatus: 'completed' } 
    });
    const totalEarnings = await db.Contract.sum('totalAmount', {
      where: { freelancerId: userId, paymentReleased: true }
    }) || 0;

    statistics = {
      totalContracts,
      activeContracts,
      completedContracts,
      totalEarnings
    };
  } else if (userType === 'client') {
    const totalContracts = await db.Contract.count({ where: { clientId: userId } });
    const activeContracts = await db.Contract.count({ 
      where: { clientId: userId, contractStatus: 'active' } 
    });
    const completedContracts = await db.Contract.count({ 
      where: { clientId: userId, contractStatus: 'completed' } 
    });
    const totalSpent = await db.Contract.sum('totalAmount', {
      where: { clientId: userId, paymentReleased: true }
    }) || 0;

    statistics = {
      totalContracts,
      activeContracts,
      completedContracts,
      totalSpent
    };
  }

  res.json({ statistics });
});

module.exports = {
  createContract,
  getContracts,
  getContractDetails,
  acceptContract,
  requestPayment,
  releasePayment,
  completeWork,
  disputeContract,
  resolveDispute,
  getContractStatistics,
};