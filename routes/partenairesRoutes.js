const express = require('express');
const router = express.Router();
const partenairesController = require('../controllers/partenairesController');
const {authenticateToken, isAdmin} = require('../middlewares/authMiddlewares');


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
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/partenaires/{id}:
 *   put:
 *     summary: Mettre à jour un partenaire
 *     tags: [Partenaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partenaire'
 *     responses:
 *       200:
 *         description: Partenaire mis à jour avec succès
 *       404:
 *         description: Partenaire non trouvé
 *       500:
 *         description: Erreur serveur
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
 *     responses:
 *       200:
 *         description: Partenaire supprimé avec succès
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
 *         - nomDuSite
 *         - url
 *         - idSynchronisation
 *         - conditionsAffiliation
 *       properties:
 *         id:
 *           type: string
 *           description: ID du partenaire
 *         nomDuSite:
 *           type: string
 *           description: Nom du site partenaire
 *         url:
 *           type: string
 *           format: uri
 *           description: URL du site partenaire
 *         idSynchronisation:
 *           type: string
 *           description: Identifiant de synchronisation unique
 *         conditionsAffiliation:
 *           type: string
 *           description: Conditions d'affiliation du partenaire
 *       example:
 *         id: "60f6c0e2e13e4f001e3e7c8c"
 *         nomDuSite: "Partenaire XYZ"
 *         url: "https://partenairexyz.com"
 *         idSynchronisation: "sync_001"
 *         conditionsAffiliation: "10% de commission sur chaque vente"
 */


