const db = require('../models/db');

// Get dashboard info for logged-in user
exports.getUserDashboard = (req, res) => {
  const userId = req.user.id;

  const clubsSql = `
    SELECT c.id, c.name, c.description
    FROM memberships m
    JOIN clubs c ON m.club_id = c.id
    WHERE m.user_id = ?
  `;

  const eventsSql = `
    SELECT e.id, e.title, e.description, e.date, c.name AS club_name
    FROM event_registrations er
    JOIN events e ON er.event_id = e.id
    JOIN clubs c ON e.club_id = c.id
    WHERE er.user_id = ?
  `;

  db.query(clubsSql, [userId], (err, clubResults) => {
    if (err) return res.status(500).json({ error: 'Failed to load clubs' });

    db.query(eventsSql, [userId], (err, eventResults) => {
      if (err) return res.status(500).json({ error: 'Failed to load events' });

      res.json({
        joinedClubs: clubResults,
        registeredEvents: eventResults
      });
    });
  });
};
