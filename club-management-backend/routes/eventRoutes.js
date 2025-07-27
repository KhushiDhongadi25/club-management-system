const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const verifyToken = require('../middleware/verifyToken');

// POST /api/events/create → Create a new event
router.post('/create', verifyToken, eventController.createEvent);

// GET /api/events/:clubId → Get all events for a club
router.get('/:clubId', eventController.getClubEvents);


// POST /api/events/register/:eventId → Register for an event
router.post('/register/:eventId', verifyToken, eventController.registerForEvent);

// GET /api/events/attendees/:eventId → Get all users registered for an event
router.get('/attendees/:eventId', verifyToken, eventController.getEventRegistrations);


module.exports = router;
