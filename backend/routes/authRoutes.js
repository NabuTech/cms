const express = require ('express');
const router = express.Router();
const authController = require ('../controllers/authController');

// User Registration
router.post('/register', authController.registerUser);

// User Login
router.post('/login', authController.loginUser);

// User Logout
router.post('/logout', authController.logoutUser);

// Fetching User Details (protected)
router.get('/user', authController.getUserDetails);

module.exports = router;
