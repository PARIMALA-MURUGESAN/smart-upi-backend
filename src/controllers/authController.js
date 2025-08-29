// src/controllers/authController.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(409).send({ error: 'Email exists' });

  const passwordHash = await argon2.hash(password); // argon2id default
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ uid: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  res.json({ token, refresh });
};
