const express = require('express');
const router = express.Router();
const { hiRoutes } = require('../controllers/hi-controller');

router.post('/hi-routes', hiRoutes);

module.exports = router;
