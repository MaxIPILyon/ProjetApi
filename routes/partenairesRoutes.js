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
