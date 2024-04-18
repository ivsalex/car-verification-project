const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const UsersController = require('../controllers/users');

//Get All Users Route
router.get('/', checkAuth, UsersController.getAllUsers);

//Create User Route
router.post('/', checkAuth, UsersController.createUser);

//Login Route
router.post('/login', UsersController.login);

module.exports = router;