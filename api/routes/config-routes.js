const express = require('express');
const router = express.Router();
const configController = require('../controllers/config-controller');

router.get('/get-seo-key', configController.handleGetSeoKey);

module.exports = router;
