const express = require('express');
const router = express.Router();

const ApiController = require('../controllers/Api');

//VGN Check Route
router.get('/vgnCheck', ApiController.vignetteCheck);

//Send SMS Route
router.post('/v1/send', ApiController.sendSms);

module.exports = router;