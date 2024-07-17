const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const UsersController = require('../controllers/Users');

//Get All Users Route
router.get('/', checkAuth, UsersController.getAllUsers);

//Create User Route
router.post('/', checkAuth, UsersController.createUser);

module.exports = router;