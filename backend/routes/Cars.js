const express = require('express');
// const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const { requireAuth } = require('@clerk/clerk-sdk-node');

const CarsController = require('../controllers/Cars');

//Get all Cars Route
router.get('/', requireAuth(), CarsController.getAllCars);

//Get all Cars Route
router.get('/expiring', requireAuth, CarsController.getAllExpiringCars);

//Get Car by Id Route
router.get('/:carId', requireAuth, CarsController.getCarById);

//Create Car Route
router.post('/', requireAuth, CarsController.carCreate);

//Delete Car Route
router.delete('/:carId', requireAuth, CarsController.carDelete);

//Modify Car Route
router.patch('/:carId', requireAuth, CarsController.carModify);

module.exports = router;