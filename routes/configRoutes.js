const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configController');
const {authenticateToken, isAdmin} = require('../middlewares/authMiddlewares');

router.get('/configurations', configurationController.getConfigurations);
router.get('/configurations/:id', configurationController.getConfiguration);
router.post('/configurations', authenticateToken, configurationController.createConfiguration);
router.put('/configurations/:id', authenticateToken, isAdmin,configurationController.updateConfiguration);
router.delete('/configurations/:id', authenticateToken, isAdmin, configurationController.deleteConfiguration);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Configurations
 *     description: API pour la gestion des configurations utilisateur
 */

/**
 * @swagger
 * /api/configurations:
 *   get:
 *     summary: Récupérer toutes les configurations
 *     tags: [Configurations]
 *     responses:
 *       200:
 *         description: Liste de toutes les configurations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Configuration'
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/configurations/{id}:
 *   get:
 *     summary: Récupérer une configuration par son ID
 *     tags: [Configurations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la configuration à récupérer
 *     responses:
 *       200:
 *         description: Détails de la configuration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Configuration'
 *       404:
 *         description: Configuration non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/configurations:
 *   post:
 *     summary: Créer une nouvelle configuration (utilisateur authentifié)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Configuration #1
 *               components:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60c72b2f9b1e8b001f8f4b1d"]
 *     responses:
 *       201:
 *         description: Configuration créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Configuration'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé – authentification requise
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/configurations/{id}:
 *   put:
 *     summary: Mettre à jour une configuration existante (authentifié)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la configuration à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nouvelle configuration mise à jour
 *               components:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60c72b2f9b1e8b001f8f4b3f"]
 *     responses:
 *       200:
 *         description: Configuration mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Configuration'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Configuration non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * /api/configurations/{id}:
 *   delete:
 *     summary: Supprimer une configuration par son ID (authentifié)
 *     tags: [Configurations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la configuration à supprimer
 *     responses:
 *       200:
 *         description: Configuration supprimée avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Configuration non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Configuration:
 *       type: object
 *       required:
 *         - user
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Identifiant unique de la configuration.
 *           example: 60c72b2f9b1e8b001f8f4b5a
 *         user:
 *           type: string
 *           description: Référence à l'identifiant de l'utilisateur (User).
 *           example: 60c72b2f9b1e8b001f8f4a9e
 *         name:
 *           type: string
 *           description: Nom de la configuration.
 *           example: Ma config de test
 *         components:
 *           type: array
 *           description: Liste des identifiants des composants liés.
 *           items:
 *             type: string
 *           example: ["60c72b2f9b1e8b001f8f4b1d", "60c72b2f9b1e8b001f8f4b2e"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la configuration.
 *           example: 2025-06-20T14:00:00.000Z
 */
