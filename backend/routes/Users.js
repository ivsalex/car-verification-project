const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users');

router.get('/', UsersController.getAllUsers);

router.post('/', UsersController.createUser);

router.post('/login', UsersController.login);

module.exports = router;