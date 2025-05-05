const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middlewares/authMiddlewares');

// Lecture
router.get('/categories', categoryController.getCategories);

// Admin uniquement
router.post('/categories', authenticateToken, categoryController.createCategory);

module.exports = router;
