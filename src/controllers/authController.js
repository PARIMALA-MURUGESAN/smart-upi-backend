// src/controllers/authController.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
// Register
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
