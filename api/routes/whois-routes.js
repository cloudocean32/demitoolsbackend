const express = require('express');
const router = express.Router();
const { whoisCheck } = require('../controllers/whois-controller');

router.post('/whois', whoisCheck);

module.exports = router; 
