const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const upiRoutes = require("./src/routes/upiRoutes");
const preferenceRoutes = require("./src/routes/preferenceRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const historyRoutes = require("./src/routes/historyRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upi", upiRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/history", historyRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 Smart UPI Backend is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
