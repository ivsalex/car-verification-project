const express = require('express');
// const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const { requireAuth } = require('@clerk/clerk-sdk-node');

const CarsController = require('../controllers/Cars');

//Get all Cars Route
router.get('/', CarsController.getAllCars);

//Get all Cars Route
router.get('/expiring', CarsController.getAllExpiringCars);

//Get Car by Id Route
router.get('/:carId', CarsController.getCarById);

//Create Car Route
router.post('/', CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', CarsController.carModify);

module.exports = router;