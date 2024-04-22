const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const Car = require('../models/Car');

exports.carCreate = async (req, res, next) => {
    try {
        const checkedCars = await Car.find({ carVin: req.body.carVin });
        if (checkedCars.length >= 1) {
            return res.status(500).json({
                message: 'This VIN is already in use!'
            })
        }

        const checkedCarsPlate = await Car.find({ plateNumber: req.body.plateNumber });
        if (checkedCarsPlate.length >= 1) {
            return res.status(500).json({
                message: 'This Plate Number is already in use!'
            });
        }

        const car = new Car({
            _id: new mongoose.Types.ObjectId(),
            carVin: req.body.carVin,
            owner: req.body.owner,
            plateNumber: req.body.plateNumber,
            checkUpExpirationDate: req.body.checkUpExpirationDate,
            vignetteExpirationDate: req.body.vignetteExpirationDate
        });

        const result = await car.save();

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
            .select('_id carVin owner plateNumber vignetteExpirationDate checkUpExpirationDate');

        const cars = docs.map(doc => ({
            _id: doc._id,
            carVin: doc.carVin,
            owner: doc.owner,
            plateNumber: doc.plateNumber,
            vignetteExpirationDate: doc.vignetteExpirationDate,
            checkUpExpirationDate: doc.checkUpExpirationDate
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

exports.getAllExpiringCars = async (req, res, next) => {
    try {
        let { range, type } = req.query;

        if (!['week', '2weeks', 'month'].includes(range)) {
            range = 'week';
        }

        if (!['checkup', 'vignette'].includes(type)) {
            type = 'checkup';
        }

        let startOfRange = new Date();
        let endOfRange = new Date();

        if (range === 'week') {
            startOfRange.setHours(0, 0, 0, 0);
            endOfRange.setDate(endOfRange.getDate() + (7 - endOfRange.getDay()));
            endOfRange.setHours(23, 59, 59, 999);
        } else if (range === '2weeks') {
            startOfRange.setHours(0, 0, 0, 0);
            endOfRange.setDate(endOfRange.getDate() + (14 - endOfRange.getDay()));
            endOfRange.setHours(23, 59, 59, 999);
        } else if (range === 'month') {
            startOfRange.setHours(0, 0, 0, 0);
            endOfRange.setMonth(endOfRange.getMonth() + 1);
            endOfRange.setDate(0);
            endOfRange.setHours(23, 59, 59, 999);
        }

        let docs;
        if (type === 'checkup') {
            docs = await Car.find({
                checkUpExpirationDate: { $gte: startOfRange, $lte: endOfRange }
            }).select('_id carVin owner plateNumber vignetteExpirationDate checkUpExpirationDate');
        } else if (type === 'vignette') {
            docs = await Car.find({
                vignetteExpirationDate: { $gte: startOfRange, $lte: endOfRange }
            }).select('_id carVin owner plateNumber vignetteExpirationDate checkUpExpirationDate');
        }

        const dueCars = docs.map(doc => ({
            _id: doc._id,
            carVin: doc.carVin,
            owner: doc.owner,
            plateNumber: doc.plateNumber,
            vignetteExpirationDate: doc.vignetteExpirationDate,
            checkUpExpirationDate: doc.checkUpExpirationDate
        }));

        res.status(200).json({
            count: dueCars.length,
            dueCars: dueCars
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
}

exports.getCarById = async (req, res, next) => {
    try {
        const id = req.params.carId;
        const doc = await Car.findById(id);

        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No valid entry for that ID' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};

exports.carDelete = async (req, res, next) => {
    try {
        const id = req.params.carId;
        const result = await Car.deleteOne({ _id: id });

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.carModify = async (req, res, next) => {
    try {
        const id = req.params.carId;
        const updateOps = {};
        for (const ops of req.body) {
            updateOps[ops.propName] = ops.value;
        }
        const result = await Car.updateOne({ _id: id }, { $set: updateOps });

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};