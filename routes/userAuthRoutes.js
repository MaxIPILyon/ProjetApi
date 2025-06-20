const express=require("express");
const router=express.Router();
const userAuthController=require("../controllers/userAuthController");

// routes d'authentification
router.post("/register", userAuthController.register);
router.post("/login", userAuthController.login);

module.exports = router;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès.
 *       400:
 *         description: Données d'entrée invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifier un utilisateur et retourner un jeton.
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Authentification réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants invalides.
 *       500:
 *         description: Erreur interne du serveur.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - username
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: Jean
 *         lastName:
 *           type: string
 *           example: Dupont
 *         email:
 *           type: string
 *           format: email
 *           example: utilisateur@exemple.com
 *         username:
 *           type: string
 *           example: jean_d
 *         password:
 *           type: string
 *           format: password
 *           example: motDePasseFort123
 *         admin:
 *           type: boolean
 *           default: false
 *           example: false
 * 
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: utilisateur@exemple.com
 *         password:
 *           type: string
 *           format: password
 *           example: motDePasseFort123
 */
