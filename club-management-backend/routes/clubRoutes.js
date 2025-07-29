const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const verifyToken = require('../middleware/verifyToken');

// POST /api/clubs/create  → Create a new club
router.post('/create', verifyToken, clubController.createClub);

// POST /api/clubs/join/:clubId → Join a club by ID
router.post('/join/:clubId', verifyToken, clubController.joinClub);

// GET /api/clubs/all → Get all clubs
router.get('/all', clubController.getAllClubs);

// GET /api/clubs/my → Get clubs the user has joined
router.get('/my', verifyToken, clubController.getMyClubs);


module.exports = router;
