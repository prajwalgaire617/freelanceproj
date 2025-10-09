const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const jobPostController = require('../controllers/jobPostController');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job post related endpoints
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all public job posts
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPost'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalJobs:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */
router.get('/', jobPostController.getAllJobs);

/**
 * @swagger
 * /api/jobs/featured:
 *   get:
 *     summary: Get featured jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of featured jobs to return
 *     responses:
 *       200:
 *         description: Featured jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPost'
 */
router.get('/featured', jobPostController.getFeaturedJobs);

/**
 * @swagger
 * /api/jobs/urgent:
 *   get:
 *     summary: Get urgent jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of urgent jobs to return
 *     responses:
 *       200:
 *         description: Urgent jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/JobPost'
 */
router.get('/urgent', jobPostController.getUrgentJobs);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get single job post
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
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
 *   put:
 *     summary: Update job post
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostUpdate'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/JobPost'
 *       404:
 *         description: Job not found or access denied
 *   delete:
 *     summary: Delete job post
 *     tags: [Jobs]
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
 *         description: Job deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Job not found or access denied
 */
router.get('/:id', jobPostController.getJobById);
router.put('/:id', authenticateToken, requireRole('client'), jobPostController.updateJobPost);
router.delete('/:id', authenticateToken, requireRole('client'), jobPostController.deleteJobPost);

/**
 * @swagger
 * /api/jobs/{id}/stats:
 *   get:
 *     summary: Get job statistics
 *     tags: [Jobs]
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
 *         description: Job statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalApplications:
 *                       type: integer
 *                     statusCounts:
 *                       type: object
 *                     jobViews:
 *                       type: integer
 *       404:
 *         description: Job not found or access denied
 */
router.get('/:id/stats', authenticateToken, requireRole('client'), jobPostController.getJobStats);

module.exports = router;
