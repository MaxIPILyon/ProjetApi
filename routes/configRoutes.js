const express = require('express');
const router = express.Router();
const configurationController = require('../controllers/configurationController');
//const { verifyToken } = require('../middlewares/authMiddlewares');

router.get('/configurations', configurationController.getConfigurations);

module.exports = router;