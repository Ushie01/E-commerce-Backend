const express = require('express');
const functionCon = require('../lambda/hello')
const router = express.Router();

router
    .route('/')
    .get(functionCon.handler);

module.exports = router;