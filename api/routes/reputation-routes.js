const express = require('express');
const router = express.Router();
const reputationController = require('../controllers/reputation-controller');

router.post('/reputation', reputationController.getReputation);

module.exports = router;
