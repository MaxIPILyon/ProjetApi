const express = require("express");
const router = express.Router();
const userApiController = require("../controllers/userApiController");
const { authenticateToken, isAdmin } = require("../middlewares/authMiddlewares");


// router.route("/users").get(authenticateToken, isAdmin, userApiController.getUsers);
// router.route("/:id").get(authenticateToken, isAdmin, userApiController.getUser);
// router.route("/").post(authenticateToken, isAdmin, userApiController.createUser);
// router.route("/:id").put(authenticateToken, isAdmin, userApiController.updateUser);
// router.route("/:id").delete(authenticateToken, isAdmin, userApiController.deleteUser);

router.get("/users", userApiController.getUsers);
router.get("/:id",  userApiController.getUser);
router.post("/", userApiController.createUser);
router.put("/:id", userApiController.updateUser);
router.delete("/:id", userApiController.deleteUser);




module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Points d'entrée de l'API pour la gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs.
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         description: Non autorisé - Token manquant ou invalide.
 *       500:
 *         description: Erreur interne du serveur.
 *   post:
 *     summary: Créer un nouvel utilisateur.
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UtilisateurInput'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Requête invalide.
 *       401:
 *         description: Non autorisé.
 *       500:
 *         description: Erreur interne du serveur.
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID.
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       401:
 *         description: Non autorisé.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 *   put:
 *     summary: Mettre à jour un utilisateur par son ID.
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UtilisateurInput'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Utilisateur'
 *       400:
 *         description: Requête invalide.
 *       401:
 *         description: Non autorisé.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 *   delete:
 *     summary: Supprimer un utilisateur par son ID.
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur.
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès.
 *       401:
 *         description: Non autorisé.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Utilisateur:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *         - firstName
 *         - lastName
 *         - admin
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique de l'utilisateur
 *         firstName:
 *           type: string
 *           description: Prénom de l'utilisateur
 *         lastName:
 *           type: string
 *           description: Nom de famille de l'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         admin:
 *           type: boolean
 *           description: Indique si l'utilisateur est administrateur
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière modification
 *     UtilisateurInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *       properties:
 *         firstName:
 *           type: string
 *           description: Prénom du nouvel utilisateur
 *         lastName:
 *           type: string
 *           description: Nom de famille du nouvel utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email du nouvel utilisateur
 *         username:
 *           type: string
 *           description: Nom d'utilisateur du nouvel utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe du nouvel utilisateur
 *         admin:
 *           type: boolean
 *           description: Statut administrateur (optionnel, par défaut false)
 */

