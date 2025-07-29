const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now req.user.id and req.user.role is available
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};
