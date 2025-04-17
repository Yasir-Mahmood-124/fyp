const express = require('express');
const router = express.Router();
const erdController = require('../controllers/erdController');
const validateRequest = require('../Middleware/validateRequest');

// Define the route to generate ERD
router.post('/generate-erd', validateRequest, erdController.generateERD);

module.exports = router;
