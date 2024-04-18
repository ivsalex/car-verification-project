const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const Car = require('../models/Car');

exports.carCreate = async (req, res, next) => {
    try {
        const checkedCars = await Car.find({ vin: req.body.vin });
        if (checkedCars.length >= 1) {
            return res.status(500).json({
                message: 'This VIN is already in use!'
            })
        }

        const car = new Car({
            _id: new mongoose.Types.ObjectId(),
            carVin: req.body.carVin,
            owner: req.body.owner,
            plateNumber: req.body.plateNumber,
            startDate: req.body.startDate,
            expirationDate: req.body.expirationDate
        });

        const result = await car.save();

        console.log(result);
        res.status(201).json({
            message: 'Car created!',
            car: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.getAllCars = async (req, res, next) => {
    try {
        const docs = await Car.find()
            .select('_id carVin owner plateNumber startDate expirationDate');

        const cars = docs.map(doc => ({
            _id: doc._id,
            carVin: doc.carVin,
            owner: doc.owner,
            plateNumber: doc.plateNumber,
            startDate: doc.startDate,
            expirationDate: doc.expirationDate
        }));

        res.status(200).json({
            count: cars.length,
            cars: cars
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};