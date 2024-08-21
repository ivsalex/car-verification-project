const express = require('express');
const router = express.Router();

const NotificationsController = require('../controllers/Notifications');

//GET All Notifications Route
router.get('/', NotificationsController.getAllNotifications);

//Create Notification Route
router.post('/', NotificationsController.createNotification);

//GET Credit
router.get('/credit', NotificationsController.checkCredit);

module.exports = router;