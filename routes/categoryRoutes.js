const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {authenticateToken, isAdmin} = require('../middlewares/authMiddlewares');

// Lecture
router.get('/categories', categoryController.getCategories);

// Admin uniquement
router.post('/categories', authenticateToken, categoryController.createCategory);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Catégories
 *   description: API pour la gestion des catégories de produits
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupérer la liste de toutes les catégories.
 *     tags: [Catégories]
 *     responses:
 *       200:
 *         description: Réponse réussie contenant la liste des catégories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erreur interne du serveur.
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une nouvelle catégorie (administrateur uniquement).
 *     tags: [Catégories]
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
 *         description: Catégorie créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Requête invalide – données manquantes ou incorrectes.
 *       401:
 *         description: Non autorisé – authentification requise.
 *       500:
 *         description: Erreur interne du serveur.
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
 *         _id:
 *           type: string
 *           description: L'identifiant auto-généré de la catégorie (MongoDB ObjectId).
 *           example: 60c72b2f9b1e8b001f8f4b5a
 *         name:
 *           type: string
 *           description: Le nom de la catégorie (doit être unique).
 *           example: Electronics
 */

