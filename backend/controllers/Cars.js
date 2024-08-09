const mongoose = require('mongoose');

const Car = require('../models/Car');

exports.carCreate = async (req, res, next) => {
    try {
        const checkedCarsVin = await Car.find({ carVin: req.body.carVin });
        if (checkedCarsVin.length >= 1) {
            return res.status(409).json({
                message: 'This VIN is already in use!'
            });
        }

        const checkedCarsPlate = await Car.find({ plateNumber: req.body.plateNumber });
        if (checkedCarsPlate.length >= 1) {
            return res.status(409).json({
                message: 'This Plate Number is already in use!'
            });
        }

        const car = new Car({
            _id: new mongoose.Types.ObjectId(),
            carVin: req.body.carVin,
            carCiv: req.body.carCiv,
            owner: req.body.owner,
            ownerPhoneNumber: req.body.ownerPhoneNumber,
            plateNumber: req.body.plateNumber,
            insuranceExpirationDate: req.body.insuranceExpirationDate,
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

exports.existingCarCheck = async (req, res, next) => {
    try {
        const { carVin, plateNumber } = req.query;

        if (!carVin && !plateNumber) {
            return res.status(400).json({
                message: 'VIN or Plate Number is required for checking existence.'
            });
        }

        const existingCarByVin = await Car.findOne({ carVin });
        if (existingCarByVin) {
            return res.status(409).json({
                message: 'This VIN is already in use!'
            });
        }

        const existingCarByPlate = await Car.findOne({ plateNumber });
        if (existingCarByPlate) {
            return res.status(409).json({
                message: 'This Plate Number is already in use!'
            });
        }

        res.status(200).json({
            message: 'Car does not exist. Safe to proceed with creation.'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'An error occurred while checking for existing car.'
        });
    }
};

exports.getAllCars = async (req, res, next) => {
    try {
        const docs = await Car.find()
            .select('_id carVin carCiv owner ownerPhoneNumber plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate lastNotificationDate');

        const cars = docs.map(doc => ({
            _id: doc._id,
            carVin: doc.carVin,
            carCiv: doc.carCiv,
            owner: doc.owner,
            ownerPhoneNumber: doc.ownerPhoneNumber,
            plateNumber: doc.plateNumber,
            insuranceExpirationDate: doc.insuranceExpirationDate,
            vignetteExpirationDate: doc.vignetteExpirationDate,
            checkUpExpirationDate: doc.checkUpExpirationDate,
            lastNotificationDate: doc.lastNotificationDate
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

        if (range !== 'today' && range !== 'week' && range !== '2weeks' && range !== 'month') {
            range = 'week';
        }

        if (type !== 'checkup' && type !== 'vignette') {
            type = 'checkup';
        }

        let startOfRange = new Date();
        let endOfRange = new Date();

        if (range === 'today') {
            startOfRange.setHours(0, 0, 0, 0);
            endOfRange.setHours(23, 59, 59, 999);
        } else if (range === 'week') {
            endOfRange.setDate(endOfRange.getDate() + (8 - endOfRange.getDay()));
        } else if (range === '2weeks') {
            endOfRange.setDate(endOfRange.getDate() + (14 - endOfRange.getDay()));
        } else if (range === 'month') {
            endOfRange.setMonth(endOfRange.getMonth() + 1);
        }

        let docs;
        if (type === 'checkup') {
            docs = await Car.find({
                checkUpExpirationDate: { $gte: startOfRange, $lte: endOfRange }
            }).select('_id carVin owner plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate lastNotificationDate');
        } else if (type === 'vignette') {
            docs = await Car.find({
                vignetteExpirationDate: { $gte: startOfRange, $lte: endOfRange }
            }).select('_id carVin owner plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate lastNotificationDate');
        }

        const dueCars = docs.map(doc => ({
            _id: doc._id,
            carVin: doc.carVin,
            carCiv: doc.carCiv,
            owner: doc.owner,
            plateNumber: doc.plateNumber,
            insuranceExpirationDate: doc.insuranceExpirationDate,
            vignetteExpirationDate: doc.vignetteExpirationDate,
            checkUpExpirationDate: doc.checkUpExpirationDate,
            lastNotificationDate: doc.lastNotificationDate
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
        const { carId } = req.params;
        const { carVin, carCiv, owner, ownerPhoneNumber, plateNumber, insuranceExpirationDate, checkUpExpirationDate, vignetteExpirationDate, lastNotificationDate } = req.body;

        const result = await Car.updateOne({ _id: carId }, { carVin, carCiv, owner, plateNumber, ownerPhoneNumber, insuranceExpirationDate, checkUpExpirationDate, vignetteExpirationDate, lastNotificationDate });

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }

        res.status(200).json({ message: 'Car modified successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};