const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Catégories
router.get('/categories', componentController.getCategories);
router.get('/categories/:id/components', componentController.getComponentsByCategory);

// Composants
router.get('/components/:id', componentController.getComponentById);

// Admin uniquement pour ces routes
router.post('/components', authenticateToken, componentController.createComponent);
router.put('/components/:id', authenticateToken, componentController.updateComponent);
router.delete('/components/:id', authenticateToken, componentController.deleteComponent);

module.exports = router;
