const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

const CarsController = require('../controllers/Cars');

//Get all Cars Route
router.get('/', ClerkExpressRequireAuth(), CarsController.getAllCars);

//Get all Cars Route
router.get('/expiring', ClerkExpressRequireAuth(), CarsController.getAllExpiringCars);

//Check if a car already exists
router.get('/existing', ClerkExpressRequireAuth(), CarsController.existingCarCheck);

//Get Car by Id Route
router.get('/:carId', ClerkExpressRequireAuth(), CarsController.getCarById);

//Create Car Route
router.post('/', ClerkExpressRequireAuth(), CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', ClerkExpressRequireAuth(), CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', ClerkExpressRequireAuth(), CarsController.carModify);

module.exports = router;