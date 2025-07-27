const db = require('../models/db');

// Create a new club
exports.createClub = (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id; // comes from verifyToken

  const sql = 'INSERT INTO clubs (name, description, created_by) VALUES (?, ?, ?)';
  db.query(sql, [name, description, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create club' });
    }
    res.status(201).json({ message: 'Club created successfully', clubId: result.insertId });
  });
};

// Join a club
exports.joinClub = (req, res) => {
  const clubId = req.params.clubId;
  const userId = req.user.id;

  const sql = 'INSERT INTO memberships (user_id, club_id) VALUES (?, ?)';
  db.query(sql, [userId, clubId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to join club' });
    }
    res.status(200).json({ message: 'Joined the club successfully' });
  });
};

// View all clubs
exports.getAllClubs = (req, res) => {
  const sql = 'SELECT * FROM clubs';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch clubs' });
    }
    res.json({ clubs: results });
  });
};

// View clubs the user has joined
exports.getMyClubs = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT c.* FROM clubs c
    JOIN memberships m ON c.id = m.club_id
    WHERE m.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch your clubs' });
    }
    res.json({ myClubs: results });
  });
};

