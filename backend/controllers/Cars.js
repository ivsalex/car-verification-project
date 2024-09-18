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
      "_id carVin carCiv owner ownerPhoneNumber plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate vignetteRequired"
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

    let startOfRange = new Date();
    let endOfRange = new Date();

    switch (range) {
      case "expired":
        startOfRange = new Date(0);
        endOfRange.setDate(endOfRange.getDate() - 1);
        break;

      case "today":
        startOfRange.setHours(0, 0, 0, 0);
        endOfRange.setHours(23, 59, 59, 999);
        break;

      case "1week":
        startOfRange.setDate(startOfRange.getDate());
        endOfRange.setDate(startOfRange.getDate() + 7);
        break;

      case "2weeks":
        startOfRange.setDate(startOfRange.getDate());
        endOfRange.setDate(startOfRange.getDate() + 14);
        break;

      case "month":
        startOfRange.setDate(startOfRange.getDate());
        endOfRange.setDate(startOfRange.getDate() + 30);
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
            { [expirationField]: { $lt: endOfRange } },
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

    const sortOptions = {};

    if (type === "vignette") {
      if (range === "expired") {
        sortOptions.owner = 1;
      } else {
        sortOptions.vignetteExpirationDate = 1;
      }
    } else if (type === "insurance") {
      sortOptions.insuranceExpirationDate = 1;
    } else if (type === "checkup") {
      sortOptions.checkUpExpirationDate = 1;
    }

    const docs = await Car.find(query).select(
      "_id carVin owner ownerPhoneNumber plateNumber insuranceExpirationDate vignetteExpirationDate checkUpExpirationDate vignetteRequired lastNotificationDate notifications"
    ).sort(sortOptions);

    const dueCars = docs.map((doc) => {
      const notification = doc.notifications.find(n => n.type === type);

      return {
        _id: doc._id,
        carVin: doc.carVin,
        carCiv: doc.carCiv,
        owner: doc.owner,
        ownerPhoneNumber: doc.ownerPhoneNumber,
        plateNumber: doc.plateNumber,
        insuranceExpirationDate: doc.insuranceExpirationDate,
        vignetteExpirationDate: doc.vignetteExpirationDate,
        checkUpExpirationDate: doc.checkUpExpirationDate,
        lastNotificationDate: notification ? notification.sentDate : null,
        vignetteRequired: doc.vignetteRequired,
        notifications: doc.notifications
      };
    });

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
      vignetteRequired,
      notifications,
    } = req.body;

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    car.carVin = carVin !== undefined ? carVin : car.carVin;
    car.carCiv = carCiv !== undefined ? carCiv : car.carCiv;
    car.owner = owner !== undefined ? owner : car.owner;
    car.plateNumber = plateNumber !== undefined ? plateNumber : car.plateNumber;
    car.ownerPhoneNumber = ownerPhoneNumber !== undefined ? ownerPhoneNumber : car.ownerPhoneNumber;
    car.insuranceExpirationDate = insuranceExpirationDate !== undefined ? insuranceExpirationDate : car.insuranceExpirationDate;
    car.checkUpExpirationDate = checkUpExpirationDate !== undefined ? checkUpExpirationDate : car.checkUpExpirationDate;
    car.vignetteExpirationDate = vignetteExpirationDate !== undefined ? vignetteExpirationDate : car.vignetteExpirationDate;
    car.vignetteRequired = vignetteRequired !== undefined ? vignetteRequired : car.vignetteRequired;

    if (Array.isArray(notifications)) {
      notifications.forEach((newNotification) => {
        const index = car.notifications.findIndex(
          (n) => n.type === newNotification.type
        );

        if (index !== -1) {
          car.notifications[index] = {
            ...car.notifications[index],
            ...newNotification,
          };
        } else {
          car.notifications.push(newNotification);
        }
      });
    }

    await car.save();

    res.status(200).json({ message: "Car modified successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
