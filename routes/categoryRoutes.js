const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
//console.log("categoryController.createCategory =", categoryController.createCategory);
const authenticateToken = require('../middlewares/authMiddlewares');
//console.log("categoryRoutes loaded");

// Lecture
router.get('/categories', categoryController.getCategories);

// Admin uniquement
router.post('/categories', authenticateToken, categoryController.createCategory);

// router.post('/categories', (req, res) => {
//     res.status(200).json({ message: "Test route OK" });
//   });

module.exports = router;
