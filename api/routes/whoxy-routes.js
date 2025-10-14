const express = require('express');
const router = express.Router();
const { fetchWhoisHistory } = require('../controllers/whoxy-controller');

// Define the route for fetching Whois history
// POST /api/whois-history
router.post('/whoxy-history', fetchWhoisHistory);

module.exports = router;
