const express = require('express');
const router = express.Router();
const reputationController = require('../controllers/reputationController');

// Definisikan endpoint POST di /api/reputation
router.post('/reputation', reputationController.getReputation);

module.exports = router;
