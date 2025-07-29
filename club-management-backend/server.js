const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models/db');

dotenv.config({ path: './config/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('🎉 Club Management System Backend is Running!');
});

// Routes
const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');
const eventRoutes = require('./routes/eventRoutes'); // ✅ add this
const verifyToken = require('./middleware/verifyToken');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/events', eventRoutes); // ✅ use event routes here
app.use('/api/user', userRoutes); // 👈 Add this line

// Protected Route Example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}! You accessed a protected route.` });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
