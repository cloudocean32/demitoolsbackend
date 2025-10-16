const express = require('express');
const router = express.Router();
const { fetchWhoisHistory } = require('../controllers/whoxy-controller');

router.post('/whoxy-history', fetchWhoisHistory);

module.exports = router;
