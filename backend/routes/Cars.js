const express = require('express');
const router = express.Router();

const CarsController = require('../controllers/cars');

router.get('/', CarsController.getAllCars);
router.post('/', CarsController.carCreate);

module.exports = router;