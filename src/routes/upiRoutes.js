const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Add new UPI
router.post("/add", auth, async (req, res) => {
  try {
    const { upi } = req.body;
    if (!upi) {
      return res.status(400).json({ error: "UPI ID is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent duplicate UPI
    if (user.upis.includes(upi)) {
      return res.status(400).json({ error: "UPI already exists" });
    }

    user.upis.push(upi);
    await user.save();

    res.json({ message: "UPI added successfully", upis: user.upis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
