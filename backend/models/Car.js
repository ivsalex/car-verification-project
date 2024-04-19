const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    carVin: { type: String, required: true },
    owner: { type: String, required: true },
    plateNumber: { type: String, required: true },
    vignetteExpirationDate: { type: Date, required: true },
    checkUpExpirationDate: { type: Date, required: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;