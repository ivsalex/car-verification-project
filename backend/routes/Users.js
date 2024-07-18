const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')
const router = express.Router();

const UsersController = require('../controllers/Users');

//Get All Users Route
router.get('/', ClerkExpressRequireAuth(), UsersController.getAllUsers);

//Create User Route
router.post('/', ClerkExpressRequireAuth(), UsersController.createUser);

module.exports = router;