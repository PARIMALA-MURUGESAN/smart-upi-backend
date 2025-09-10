const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const authRoutes = require("./src/routes/authRoutes");  // 👈 make sure path is correct
const paymentRoutes = require("./src/routes/paymentRoutes");
const upiRoutes = require("./src/routes/upiRoutes");
const preferenceRoutes = require("./src/routes/preferenceRoutes");

dotenv.config();

const app=express()
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);         // 👈 register/login
app.use("/api/payments", paymentRoutes);  // 👈 send money
app.use("/api/upis", upiRoutes);          // 👈 manage UPIs
app.use("/api/preferences", preferenceRoutes); // 👈 auto-switch rules

// Default route
app.get("/", (req, res) => {
  res.send("✅ Smart UPI Backend Running");
});




const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

mongoose.connect(DB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

app.use(express.json());

// Example health route
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is live" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
