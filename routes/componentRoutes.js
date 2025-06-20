const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const {authenticateToken, isAdmin} = require('../middlewares/authMiddlewares');

// Catégories
router.get('/categories', componentController.getCategories);
router.get('/categories/:id/components', componentController.getComponentsByCategory);

// Composants
router.get('/components', componentController.getComponents);
router.get('/components/:id', componentController.getComponentById);

// Admin uniquement pour ces routes
router.post('/components', authenticateToken, isAdmin, componentController.createComponent);
router.put('/components/:id', authenticateToken, isAdmin, componentController.updateComponent);
router.delete('/components/:id', authenticateToken, isAdmin, componentController.deleteComponent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Composants
 *   description: API pour gérer les composants et les catégories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Composants]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/categories/{id}/components:
 *   get:
 *     summary: Récupérer les composants d'une catégorie par ID
 *     tags: [Composants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Liste des composants de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/components/{id}:
 *   get:
 *     summary: Récupérer un composant par ID
 *     tags: [Composants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du composant
 *     responses:
 *       200:
 *         description: Détails du composant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/components:
 *   post:
 *     summary: Créer un nouveau composant
 *     tags: [Composants]
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
 *         description: Composant créé avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/components/{id}:
 *   put:
 *     summary: Mettre à jour un composant par ID
 *     tags: [Composants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du composant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Component'
 *     responses:
 *       200:
 *         description: Composant mis à jour avec succès
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/components/{id}:
 *   delete:
 *     summary: Supprimer un composant par ID
 *     tags: [Composants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du composant
 *     responses:
 *       200:
 *         description: Composant supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Composant non trouvé
 *       500:
 *         description: Erreur interne du serveur
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
 *           description: Identifiant unique de la catégorie
 *           example: "64a3fe2d5baf1a001c8df123"
 *         name:
 *           type: string
 *           description: Nom de la catégorie
 *           example: "Microcontrôleurs"
 *         description:
 *           type: string
 *           description: Description optionnelle de la catégorie
 *           example: "Tous types de microcontrôleurs programmables."

 *     Component:
 *       type: object
 *       required:
 *         - category
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique du composant
 *           example: "64a3fe2d5baf1a001c8df456"
 *         category:
 *           type: string
 *           description: ID de la catégorie à laquelle appartient ce composant
 *           example: "64a3fe2d5baf1a001c8df123"
 *         brand:
 *           type: string
 *           description: Marque du composant
 *           example: "Espressif"
 *         title:
 *           type: string
 *           description: Titre ou nom du composant
 *           example: "ESP32-WROOM-32"
 *         specs:
 *           type: string
 *           description: Spécifications techniques du composant (au format texte)
 *           example: "Dual-core, 240 MHz, Wi-Fi, Bluetooth"
 *         price:
 *           type: number
 *           format: float
 *           description: Prix du composant en euros
 *           example: 12.99
 *         imageUrl:
 *           type: string
 *           description: URL de l'image du composant
 *           example: "https://example.com/images/esp32.jpg"
 */

