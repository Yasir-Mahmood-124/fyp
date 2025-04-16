// routes/erdRoutes.js
const express = require('express');
const { generateErd } = require('../controllers/erdController');
const { validateGenerateErdRequest } = require('../middleware/requestValidator');

const router = express.Router();

router.post('/generate-erd', validateGenerateErdRequest, generateErd);

module.exports = router;