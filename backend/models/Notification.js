const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, required: true },
    owner: { type: String, required: true },
    plateNumber: { type: String, required: true },
    ownerPhoneNumber: { type: String, required: true },
    smsBody: { type: String, required: true }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;