const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    carVin: { type: String, required: true },
    carCiv: { type: String, default: null },
    owner: { type: String, required: true },
    plateNumber: { type: String, required: true },
    ownerPhoneNumber: { type: String, default: null },
    insuranceExpirationDate: { type: Date, default: null },
    vignetteExpirationDate: { type: Date, default: null },
    checkUpExpirationDate: { type: Date, dafault: null },
    lastNotificationDate: { type: Date, default: null },
    vignetteRequired: { type: Boolean },
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;