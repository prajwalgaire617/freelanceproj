/**
 * User Routes
 * Handles user-related HTTP routes
 */
const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleAuth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();
const userController = new UserController();

// Public routes
router.get('/', asyncHandler(userController.getAllUsers.bind(userController)));
router.get('/search', asyncHandler(userController.searchUsers.bind(userController)));
router.get('/statistics', asyncHandler(userController.getUserStatistics.bind(userController)));
router.get('/type/:type', asyncHandler(userController.getUsersByType.bind(userController)));
router.get('/uuid/:uuid', asyncHandler(userController.getUserByUuid.bind(userController)));

// Protected routes
router.use(authenticateToken);

router.get('/profile', asyncHandler(userController.getUserProfile.bind(userController)));
router.put('/profile', asyncHandler(userController.updateUserProfile.bind(userController)));
router.get('/:id', asyncHandler(userController.getUserById.bind(userController)));

// Admin only routes
router.post('/', requireRole(['admin']), asyncHandler(userController.createUser.bind(userController)));
router.put('/:id', requireRole(['admin']), asyncHandler(userController.updateUser.bind(userController)));
router.delete('/:id', requireRole(['admin']), asyncHandler(userController.deleteUser.bind(userController)));

module.exports = router;
