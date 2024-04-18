const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    carVin: { type: String, required: true },
    owner: { type: String, required: true },
    plateNumber: { type: String, required: true },
    startDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;