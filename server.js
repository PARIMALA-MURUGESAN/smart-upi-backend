// server.js
require('dotenv').config();   // Load .env

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const preferenceRoutes = require("./src/routes/preferenceRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");


// Import routes
const authRoutes = require("./src/routes/authRoutes");
const upiRoutes = require("./src/routes/upiRoutes");   // ✅ fixed path
const historyRoutes = require("./src/routes/historyRoutes");
const app = express();

// 🔒 Security middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/preferences", preferenceRoutes);
// Optional: Rate limit to prevent brute-force
app.use("/api/payment", paymentRoutes);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Register routes
app.use('/api/auth', authRoutes);   // ✅ Auth routes
app.use('/api/upi', upiRoutes);     // ✅ UPI routes

app.use("/api/history", historyRoutes);

// Health check
app.get('/', (req, res) => res.send('Smart UPI Backend running ✅'));

// Connect to MongoDB + start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT,"0.0.0.0" ,() => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));
