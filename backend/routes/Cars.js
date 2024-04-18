const express = require('express');
const router = express.Router();

const CarsController = require('../controllers/cars');

//Get all Cars Route
router.get('/', CarsController.getAllCars);

//Get Car by Id Route
router.get('/:carId', CarsController.getAllCars);

//Create Car Route
router.post('/', CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', CarsController.carModify);

module.exports = router;