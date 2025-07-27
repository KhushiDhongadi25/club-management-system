const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// GET /api/user/dashboard → Get user’s joined clubs and registered events
router.get('/dashboard', verifyToken, userController.getUserDashboard);

module.exports = router;
