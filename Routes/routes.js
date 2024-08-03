const express = require('express');
const router = express.Router();
const user = require('../controllers/usercontrol');
const jwtMiddleware = require('../middlewares/jwtmiddleware'); // Adjust the path as needed

// Signup
router.post('/user/register', user.register);

// Login
router.post('/user/login', user.login);


module.exports = router;
