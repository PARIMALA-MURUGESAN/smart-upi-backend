const User = require('../models/User');
const { generateUpiQr } = require('../services/qrService');
const { decrypt } = require('../services/enc');
const History = require('../models/History');

exports.addUPI = async (req, res) => {
  try {
    const { label, vpa } = req.body;
    if (!label || !vpa) {
      return res.status(400).json({ message: "Label and VPA are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // check if vpa already exists for this user
    const exists = user.upis.some(u => u.vpa_encrypted === vpa);
    if (exists) {
      return res.status(400).json({ error: "UPI already exists" });
    }

    // create new UPI entry
    const newUPI = {
      label,
      vpa_encrypted: vpa   // later you can encrypt this
    };

    user.upis.push(newUPI);
    await user.save();

    res.json({ message: "UPI added successfully", upis: user.upis });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
