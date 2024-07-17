const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

const CarsController = require('../controllers/Cars');

//Get all Cars Route
router.get('/', ClerkExpressRequireAuth, CarsController.getAllCars);

//Get all Cars Route
router.get('/expiring', ClerkExpressRequireAuth(), CarsController.getAllExpiringCars);

//Get Car by Id Route
router.get('/:carId', requireAuth, CarsController.getCarById);

//Create Car Route
router.post('/', requireAuth, CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', requireAuth, CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', requireAuth, CarsController.carModify);

module.exports = router;