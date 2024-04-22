const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const CarsController = require('../controllers/cars');

//Get all Cars Route
router.get('/', checkAuth, CarsController.getAllCars);

//Get all Cars Route
router.get('/expiring', checkAuth, CarsController.getAllExpiringCars);

//Get Car by Id Route
router.get('/:carId', checkAuth, CarsController.getCarById);

//Create Car Route
router.post('/', checkAuth, CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', checkAuth, CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', checkAuth, CarsController.carModify);

module.exports = router;