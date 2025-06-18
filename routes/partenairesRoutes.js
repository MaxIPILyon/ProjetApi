const express = require('express');
const router = express.Router();
const partenairesController = require('../controllers/partenairesController');
const authenticateToken = require('../middlewares/authMiddlewares');


router.get('/partenaires', partenairesController.getPartenaires);

router.post('/partenaires', authenticateToken, partenairesController.createPartenaires);
router.put('/partenaires/:id', authenticateToken, partenairesController.updatePartenaires);
router.delete('/partenaires/:id', authenticateToken, partenairesController.deletePartenaires);

module.exports = router;

// Partenaires , partenaires

/**
 * @swagger
 * tags:
 *   name: Partenaires
 *   description: Gestion des partenaires
 */

/**
 * @swagger
 * /api/partenaires:
 *   get:
 *     summary: Récupérer la liste des partenaires
 *     tags: [Partenaires]
 *     responses:
 *       200:
 *         description: Liste des partenaires récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partenaire'
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Créer un nouveau partenaire
 *     tags: [Partenaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partenaire'
 *     responses:
 *       201:
 *         description: Partenaire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partenaire'
 *       401:
 *         description: Non autorisé - Token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/partenaires/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire existant
 *     tags: [Partenaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du partenaire à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partenaire'
 *     responses:
 *       200:
 *         description: Partenaire mis à jour avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprimer un partenaire
 *     tags: [Partenaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du partenaire à supprimer
 *     responses:
 *       200:
 *         description: Partenaire supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Partenaire:
 *       type: object
 *       required:
 *         - nom
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: Identifiant unique du partenaire
 *         nom:
 *           type: string
 *           description: Nom du partenaire
 *         description:
 *           type: string
 *           description: Description du partenaire
 *         logo:
 *           type: string
 *           format: uri
 *           description: URL du logo du partenaire
 *       example:
 *         id: "123abc"
 *         nom: "Partenaire XYZ"
 *         description: "Entreprise partenaire spécialisée en..."
 *         logo: "https://exemple.com/logo.png"
 */

