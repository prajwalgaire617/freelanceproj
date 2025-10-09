const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const freelancerController = require('../controllers/freelancerController');

/**
 * @swagger
 * tags:
 *   name: Freelancer
 *   description: Freelancer related endpoints
 */

/**
 * @swagger
 * /api/freelancer/jobs/search:
 *   get:
 *     summary: Search jobs for freelancers
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for job title or description
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of required skills
 *       - in: query
 *         name: budgetMin
 *         schema:
 *           type: number
 *         description: Minimum budget
 *       - in: query
 *         name: budgetMax
 *         schema:
 *           type: number
 *         description: Maximum budget
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [fixed, hourly]
 *         description: Type of job
 *       - in: query
 *         name: experienceLevel
 *         schema:
 *           type: string
 *           enum: [entry, intermediate, expert]
 *         description: Required experience level
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobSearchResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/jobs/search', authenticateToken, requireRole('freelancer'), freelancerController.searchJobs);

/**
 * @swagger
 * /api/freelancer/jobs/{id}:
 *   get:
 *     summary: Get job details
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 job:
 *                   $ref: '#/components/schemas/JobPost'
 *       404:
 *         description: Job not found
 */
router.get('/jobs/:id', authenticateToken, requireRole('freelancer'), freelancerController.getJobDetails);

/**
 * @swagger
 * /api/freelancer/applications:
 *   get:
 *     summary: Get freelancer's job applications
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of applications per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, reviewed, shortlisted, rejected, accepted, withdrawn]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 applications:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobApplication'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalApplications:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */
router.get('/applications', authenticateToken, requireRole('freelancer'), freelancerController.getMyApplications);

/**
 * @swagger
 * /api/freelancer/profile:
 *   get:
 *     summary: Get freelancer profile
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 freelancer:
 *                   $ref: '#/components/schemas/Freelancer'
 *       404:
 *         description: Profile not found
 *   put:
 *     summary: Update freelancer profile
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               shortBio:
 *                 type: string
 *               expertise:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               hourlyRate:
 *                 type: number
 *               availability:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: Profile not found
 */
router.get('/profile', authenticateToken, requireRole('freelancer'), freelancerController.getProfile);
router.put('/profile', authenticateToken, requireRole('freelancer'), freelancerController.updateProfile);

/**
 * @swagger
 * /api/freelancer/connects:
 *   get:
 *     summary: Get freelancer's connect balance
 *     tags: [Freelancer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connect balance retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 connectBalance:
 *                   type: integer
 *                   example: 10
 */
router.get('/connects', authenticateToken, requireRole('freelancer'), freelancerController.getConnectBalance);

module.exports = router;
