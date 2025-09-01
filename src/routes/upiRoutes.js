// routes/upiRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const { addUPI, getSmartQr } = require("..controllers/upiController");
router.post("/add", protect, addUPI);
router.get("/qr/:purpose", protect, getSmartQr);
router.post("/add", protect, async (req, res) => {
  try {
    const { upiId } = req.body;
    if (!upiId) {
      return res.status(400).json({ message: "UPI ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.upis.push(upiId);
    await user.save();

    res.json({
      message: "UPI ID added successfully",
      upis: user.upis,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Add Transaction History
router.post("/history/add", protect, async (req, res) => {
  try {
    const { amount, to } = req.body;
    if (!amount || !to) {
      return res.status(400).json({ message: "Amount and recipient are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transaction = { amount, to, date: new Date() };
    user.history.push(transaction);
    await user.save();

    res.json({
      message: "Transaction added successfully",
      history: user.history,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Get Transaction History
router.get("/history", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Transaction history fetched successfully",
      history: user.history,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
