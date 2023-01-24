const express = require('express');
const functionCon = require('../functions/hello')
const router = express.Router();

router
    .route('/')
    .get(functionCon.handler);

module.exports = router;