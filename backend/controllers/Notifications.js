const mongoose = require('mongoose');
const axios = require('axios');

const Notification = require('../models/Notification');

exports.getAllNotifications = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};

        if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) {
                query.date = { ...query.date, $gte: start };
            } else {
                return res.status(400).json({ error: 'Invalid startDate format' });
            }
        }

        if (endDate) {
            const end = new Date(endDate);
            if (!isNaN(end.getTime())) {
                query.date = { ...query.date, $lte: end };
            } else {
                return res.status(400).json({ error: 'Invalid endDate format' });
            }
        }

        const docs = await Notification.find(query)
            .select('_id date owner plateNumber ownerPhoneNumber smsBody');

        const notifications = docs.map(doc => ({
            _id: doc._id,
            date: doc.date,
            owner: doc.owner,
            plateNumber: doc.plateNumber,
            ownerPhoneNumber: doc.ownerPhoneNumber,
            smsBody: doc.smsBody
        }));

        res.status(200).json({
            count: notifications.length,
            notifications: notifications
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.createNotification = async (req, res, next) => {
    try {
        const notification = new Notification({
            _id: new mongoose.Types.ObjectId(),
            date: req.body.date,
            owner: req.body.owner,
            plateNumber: req.body.plateNumber,
            ownerPhoneNumber: req.body.ownerPhoneNumber,
            smsBody: req.body.smsBody
        });

        const result = await notification.save();

        res.status(201).json({
            message: 'Notification saved!',
            notification: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.checkCredit = async (req, res, next) => {
    const url = 'https://app.smso.ro/api/v1/credit-check';
    try {
        const response = await axios.get(url, {
            headers: {
                'X-Authorization': process.env.SMS_APIKEY
            }
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            res.status(500).send('No response received from the server');
        } else {
            res.status(500).send(error.message);
        }
    }
};