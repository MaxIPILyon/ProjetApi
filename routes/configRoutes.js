const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configController');
//const { verifyToken } = require('../middlewares/authMiddlewares');

router.get('/configurations', configurationController.getConfigurations);

router.get('/configurations/:id', configurationController.getConfiguration);

module.exports = router;