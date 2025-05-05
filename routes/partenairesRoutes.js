const express = require('express');
const router = express.Router();
const partenairesController = require('../controllers/partenairesController');
const authenticateToken = require('../middlewares/authMiddlewares');


router.get('/partenaires', partenairesController.getPartenaires);

module.exports = router;

// Partenaires , partenaires
