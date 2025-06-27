const express = require('express');
const router = express.Router();
const { seoCheck } = require('../controllers/seo-controller');

router.post('/seo-checker', seoCheck);

module.exports = router;
