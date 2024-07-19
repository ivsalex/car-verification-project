const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

const CarsController = require('../controllers/Cars');

//Get all Cars Route
router.get('/', ClerkExpressRequireAuth(), CarsController.getAllCars);

//Get all Cars Route
router.get('/expiring', ClerkExpressRequireAuth(), CarsController.getAllExpiringCars);

//Get Car by Id Route
router.get('/:carId', ClerkExpressRequireAuth(), ClerkExpressRequireAuth, CarsController.getCarById);

//Create Car Route
router.post('/', ClerkExpressRequireAuth(), ClerkExpressRequireAuth, CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', ClerkExpressRequireAuth(), ClerkExpressRequireAuth, CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', ClerkExpressRequireAuth(), ClerkExpressRequireAuth, CarsController.carModify);

module.exports = router;