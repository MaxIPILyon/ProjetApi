const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configController');
const authenticateToken = require('../middlewares/authMiddlewares');

router.get('/configurations', configurationController.getConfigurations);
router.get('/configurations/:id', configurationController.getConfiguration);
router.post('/configurations', authenticateToken, configurationController.createConfiguration);
router.put('/configurations/:id', authenticateToken, configurationController.updateConfiguration);
router.delete('/configurations/:id', authenticateToken, configurationController.deleteConfiguration);

module.exports = router;