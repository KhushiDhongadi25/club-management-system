const db = require('../models/db');

// Get dashboard info for logged-in user
exports.getDashboard = (req, res) => {
  const userId = req.user.id;

  const userSql = `SELECT name, email FROM users WHERE id = ?`;
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
    ORDER BY e.date
  `;

  db.query(userSql, [userId], (err1, userResults) => {
    if (err1 || userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResults[0];

    db.query(clubsSql, [userId], (err2, clubResults) => {
      if (err2) return res.status(500).json({ error: 'Failed to load clubs' });

      db.query(eventsSql, [userId], (err3, eventResults) => {
        if (err3) return res.status(500).json({ error: 'Failed to load events' });

        res.json({
          name: user.name,
          email: user.email,
          joinedClubs: clubResults,
          registeredEvents: eventResults
        });
      });
    });
  });
};
