const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Catégories
router.get('/categories', componentController.getCategories);
router.get('/categories/:id', componentController.getComponentsByCategory);

// Composants
router.get('/components/:id', componentController.getComponentById);

// Admin uniquement pour ces routes
router.post('/components', authenticateToken, componentController.createComponent);
router.put('/components/:id', authenticateToken, componentController.updateComponent);
router.delete('/components/:id', authenticateToken, componentController.deleteComponent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Components
 *   description: API for managing components and categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get components by category ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: List of components in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     summary: Get component by ID
 *     tags: [Components]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *     responses:
 *       200:
 *         description: Component details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: Component not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/components:
 *   post:
 *     summary: Create a new component
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       201:
 *         description: Component created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     summary: Update a component by ID
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: Component updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Component not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     summary: Delete a component by ID
 *     tags: [Components]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Component ID
 *     responses:
 *       200:
 *         description: Component deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Component not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the category
 *           example: "64a3fe2d5baf1a001c8df123"
 *         name:
 *           type: string
 *           description: Name of the category
 *           example: "Microcontrollers"
 *         description:
 *           type: string
 *           description: Optional description of the category
 *           example: "All types of programmable microcontrollers."

 *     Component:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - categoryId
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the component
 *           example: "64a3fe2d5baf1a001c8df456"
 *         name:
 *           type: string
 *           description: Name of the component
 *           example: "ESP32"
 *         categoryId:
 *           type: string
 *           description: ID of the category this component belongs to
 *           example: "64a3fe2d5baf1a001c8df123"
 *         specs:
 *           type: object
 *           description: Technical specifications of the component
 *           additionalProperties: true
 *           example:
 *             frequency: "240 MHz"
 *             cores: 2
 *             wifi: true
 *         description:
 *           type: string
 *           description: Optional description of the component
 *           example: "A low-cost, low-power system on a chip with Wi-Fi and Bluetooth."
 */
