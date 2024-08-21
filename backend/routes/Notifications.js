const express = require('express');
const router = express.Router();

const NotificationsController = require('../controllers/Notifications');

//GET All Notifications Route
router.get('/', ClerkExpressRequireAuth(), NotificationsController.getAllNotifications);

//Create Notification Route
router.post('/', ClerkExpressRequireAuth(), NotificationsController.createNotification);

//GET Credit
router.get('/credit', ClerkExpressRequireAuth(), NotificationsController.checkCredit);

module.exports = router;