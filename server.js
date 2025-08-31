// server.js
require('dotenv').config();   // Load .env

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require("./routes/authRoutes");
const upiRoutes = require("./routes/upiRoutes");   // ✅ fixed path

const app = express();

// 🔒 Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Optional: Rate limit to prevent brute-force
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Register routes
app.use('/api/auth', authRoutes);   // ✅ Auth routes
app.use('/api/upi', upiRoutes);     // ✅ UPI routes

// Health check
app.get('/', (req, res) => res.send('Smart UPI Backend running ✅'));

// Connect to MongoDB + start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
