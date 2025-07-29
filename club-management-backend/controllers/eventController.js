const db = require('../models/db');

// Create a new event for a club — now restricted to club creator (admin)
exports.createEvent = (req, res) => {
  const { clubId, title, description, date } = req.body;
  const userId = req.user.id; // from verifyToken

  if (!clubId || !title || !description || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Step 1: Check if the user is the creator of the club
  const checkAdminSql = 'SELECT * FROM clubs WHERE id = ? AND created_by = ?';
  db.query(checkAdminSql, [clubId, userId], (err, results) => {
    if (err) {
      console.error('Club admin check error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(403).json({ error: 'Only the club creator can create events' });
    }

    // Step 2: Insert event since user is verified as club creator
    const insertSql = `
      INSERT INTO events (club_id, title, description, date, created_by)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [clubId, title, description, date, userId], (err, result) => {
      if (err) {
        console.error('Event Creation Error:', err);
        return res.status(500).json({ error: 'Failed to create event' });
      }

      res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    });
  });
};

// Get all events for a specific club
exports.getClubEvents = (req, res) => {
  const clubId = req.params.clubId;

  const sql = `
    SELECT e.*, u.username AS created_by_name
    FROM events e
    JOIN users u ON e.created_by = u.id
    WHERE club_id = ?
    ORDER BY date DESC
  `;

  db.query(sql, [clubId], (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    res.status(200).json({ events: results });
  });
};

// Register for an event
exports.registerForEvent = (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const sql = 'INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)';
  db.query(sql, [eventId, userId], (err, result) => {
    if (err) {
      console.error('Event registration error:', err);
      return res.status(500).json({ error: 'Failed to register for event' });
    }
    res.status(200).json({ message: 'Registered for event successfully' });
  });
};

// Get all users registered for a specific event
exports.getEventRegistrations = (req, res) => {
  const eventId = req.params.eventId;

  const sql = `
    SELECT u.id, u.username, u.email
    FROM event_registrations er
    JOIN users u ON er.user_id = u.id
    WHERE er.event_id = ?
  `;
  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error('Fetch registrations error:', err);
      return res.status(500).json({ error: 'Failed to fetch registrations' });
    }
    res.status(200).json({ attendees: results });
  });
};

// Edit an existing event (Only by club creator)
exports.updateEvent = (req, res) => {
  const eventId = req.params.eventId;
  const { title, description, date } = req.body;
  const userId = req.user.id;

  if (!title || !description || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const checkSql = `
    SELECT e.*, c.created_by AS clubCreator
    FROM events e
    JOIN clubs c ON e.club_id = c.id
    WHERE e.id = ?
  `;

  db.query(checkSql, [eventId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = results[0];
    if (event.clubCreator !== userId) {
      return res.status(403).json({ error: 'Only club admin can edit this event' });
    }

    const updateSql = `
      UPDATE events
      SET title = ?, description = ?, date = ?
      WHERE id = ?
    `;
    db.query(updateSql, [title, description, date, eventId], (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Failed to update event' });
      }

      res.status(200).json({ message: 'Event updated successfully' });
    });
  });
};

// Delete an event (Only by club creator)
exports.deleteEvent = (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user.id;

  const checkSql = `
    SELECT e.*, c.created_by AS clubCreator
    FROM events e
    JOIN clubs c ON e.club_id = c.id
    WHERE e.id = ?
  `;

  db.query(checkSql, [eventId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = results[0];
    if (event.clubCreator !== userId) {
      return res.status(403).json({ error: 'Only club admin can delete this event' });
    }

    const deleteSql = 'DELETE FROM events WHERE id = ?';
    db.query(deleteSql, [eventId], (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Failed to delete event' });
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    });
  });
};
