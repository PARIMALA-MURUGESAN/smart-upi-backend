
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const { getHistory } = require("../controllers/historyController");
// Add a transaction
router.post("/add", auth, async (req, res) => {
  try {
    const { amount, to, from } = req.body;
    if (!amount || !to || !from) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transaction = { amount, to, from };
    user.history.push(transaction);
    await user.save();

    res.json({ message: "Transaction added", history: user.history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/", authMiddleware, getHistory);
// Get transaction history
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ history: user.history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
