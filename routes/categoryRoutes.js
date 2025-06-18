const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Lecture
router.get('/categories', categoryController.getCategories);

// Admin uniquement
router.post('/categories', authenticateToken, categoryController.createCategory);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing product categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve a list of all categories.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A successful response with a list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (admin only).
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request – missing or invalid data.
 *       401:
 *         description: Unauthorized – authentication required.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the category.
 *           example: 60c72b2f9b1e8b001f8f4b5a
 *         name:
 *           type: string
 *           description: The name of the category.
 *           example: Electronics
 */
