const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const app = express();

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
