const mongoose = require("mongoose");

const Car = require("../models/Car");

exports.carCreate = async (req, res, next) => {
  try {
    const checkedCarsVin = await Car.find({ carVin: req.body.carVin });
    if (checkedCarsVin.length >= 1) {
      return res.status(409).json({
        message: "This VIN is already in use!",
      });
    }

    const checkedCarsPlate = await Car.find({
      plateNumber: req.body.plateNumber,
    });
    if (checkedCarsPlate.length >= 1) {
      return res.status(409).json({
        message: "This Plate Number is already in use!",
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
      vignetteExpirationDate: req.body.vignetteExpirationDate,
      vignetteRequired: req.body.vignetteRequired,
    });

    const result = await car.save();

    res.status(201).json({
      message: "Car created!",
      car: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.existingCarCheck = async (req, res, next) => {
  try {
    const { carVin, plateNumber } = req.query;

    if (!carVin && !plateNumber) {
      return res.status(400).json({
        message: "VIN or Plate Number is required for checking existence.",
      });
    }

    const existingCarByVin = await Car.findOne({ carVin });
    if (existingCarByVin) {
      return res.status(409).json({
        message: "This VIN is already in use!",
      });
    }

    const existingCarByPlate = await Car.findOne({ plateNumber });
    if (existingCarByPlate) {
      return res.status(409).json({
        message: "This Plate Number is already in use!",
      });
    }

    res.status(200).json({
      message: "Car does not exist. Safe to proceed with creation.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "An error occurred while checking for existing car.",
    });
  }
};

exports.getAllCars = async (req, res, next) => {
  try {
    const docs = await Car.find().select(
      "_id carVin carCiv owner ownerPhoneNumber plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate lastNotificationDate vignetteRequired"
    ).sort({ owner: 1 });

    const cars = docs.map((doc) => ({
      _id: doc._id,
      carVin: doc.carVin,
      carCiv: doc.carCiv,
      owner: doc.owner,
      ownerPhoneNumber: doc.ownerPhoneNumber,
      plateNumber: doc.plateNumber,
      insuranceExpirationDate: doc.insuranceExpirationDate,
      vignetteExpirationDate: doc.vignetteExpirationDate,
      checkUpExpirationDate: doc.checkUpExpirationDate,
      lastNotificationDate: doc.lastNotificationDate,
      vignetteRequired: doc.vignetteRequired,
    }));
    res.status(200).json({
      count: cars.length,
      cars: cars,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.getAllExpiringCars = async (req, res, next) => {
  try {
    let { range, type } = req.query;

    if (
      range !== "expired" &&
      range !== "today" &&
      range !== "week" &&
      range !== "2weeks" &&
      range !== "month"
    ) {
      range = "week";
    }

    if (type !== "checkup" && type !== "vignette" && type !== "insurance") {
      type = "checkup";
    }

    let startOfRange = new Date();
    let endOfRange = new Date();

    switch (range) {
      case "expired":
        startOfRange = new Date(0);
        endOfRange = new Date();
        endOfRange.setDate(endOfRange.getDate() - 1);
        endOfRange.setHours(23, 59, 59, 999);
        break;

      case "today":
        startOfRange.setHours(0, 0, 0, 0);
        endOfRange.setHours(23, 59, 59, 999);
        break;

      case "week":
        endOfRange.setDate(endOfRange.getDate() + (8 - endOfRange.getDay()));
        break;

      case "2weeks":
        endOfRange.setDate(endOfRange.getDate() + (14 - endOfRange.getDay()));
        break;

      case "month":
        endOfRange.setMonth(endOfRange.getMonth() + 1);
        break;

      default:
        break;
    }

    let expirationField;

    switch (type) {
      case "checkup":
        expirationField = "checkUpExpirationDate";
        break;
      case "vignette":
        expirationField = "vignetteExpirationDate";
        break;
      case "insurance":
        expirationField = "insuranceExpirationDate";
        break;
      default:
        expirationField = null;
    }

    let query;

    if (range === "expired") {
      if (type === "vignette") {
        query = {
          $and: [
            {
              $or: [
                { [expirationField]: { $gte: startOfRange, $lte: endOfRange } },
                { [expirationField]: null },
              ],
            },
            { vignetteRequired: true },
          ],
        };
      } else if (type === "insurance") {
        query = {
          [expirationField]: { $lt: new Date() },
        };
      } else {
        query = {
          $or: [
            { [expirationField]: { $lt: new Date() } },
            { [expirationField]: null },
          ],
        };
      }
    } else {
      if (type === "vignette") {
        query = {
          $and: [
            { [expirationField]: { $gte: startOfRange, $lte: endOfRange } },
            { vignetteRequired: true },
          ],
        };
      } else {
        query = {
          [expirationField]: { $gte: startOfRange, $lte: endOfRange },
        };
      }
    }

    const sortOptions = type === "vignette" && range === "expired" ? { owner: 1 } : {};

    const docs = await Car.find(query).select(
      "_id carVin owner ownerPhoneNumber plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate lastNotificationDate vignetteRequired"
    ).sort(sortOptions);

    const dueCars = docs.map((doc) => ({
      _id: doc._id,
      carVin: doc.carVin,
      carCiv: doc.carCiv,
      owner: doc.owner,
      ownerPhoneNumber: doc.ownerPhoneNumber,
      plateNumber: doc.plateNumber,
      insuranceExpirationDate: doc.insuranceExpirationDate,
      vignetteExpirationDate: doc.vignetteExpirationDate,
      checkUpExpirationDate: doc.checkUpExpirationDate,
      lastNotificationDate: doc.lastNotificationDate,
      vignetteRequired: doc.vignetteRequired,
    }));

    res.status(200).json({
      count: dueCars.length,
      dueCars: dueCars,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.getCarById = async (req, res, next) => {
  try {
    const id = req.params.carId;
    const doc = await Car.findById(id);

    if (doc) {
      res.status(200).json(doc);
    } else {
      res.status(404).json({ message: "No valid entry for that ID" });
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
      error: err,
    });
  }
};

exports.carModify = async (req, res, next) => {
  try {
    const { carId } = req.params;
    const {
      carVin,
      carCiv,
      owner,
      ownerPhoneNumber,
      plateNumber,
      insuranceExpirationDate,
      checkUpExpirationDate,
      vignetteExpirationDate,
      lastNotificationDate,
      vignetteRequired,
    } = req.body;

    const result = await Car.updateOne(
      { _id: carId },
      {
        carVin,
        carCiv,
        owner,
        plateNumber,
        ownerPhoneNumber,
        insuranceExpirationDate,
        checkUpExpirationDate,
        vignetteExpirationDate,
        lastNotificationDate,
        vignetteRequired,
      }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.status(200).json({ message: "Car modified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
