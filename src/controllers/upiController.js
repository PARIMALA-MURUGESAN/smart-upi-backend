
const User = require('../models/User');
const { generateUpiQr } = require('../services/qrService');
const { decrypt } = require('../services/enc');
const History = require('../models/History');


export const addUpi = async (req, res) => {
  try {
    const { upiId } = req.body;

    if (!upiId) {
      return res.status(400).json({ error: "UPI ID is required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent duplicate UPI
    if (user.upis.includes(upiId)) {
      return res.status(400).json({ error: "UPI already exists" });
    }

    user.upis.push(upiId);
    await user.save();

    res.json({ message: "UPI added successfully", upis: user.upis });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

async function getQr(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const preferred = user.upis.id(user.preference.preferredUpiId);
    if (!preferred) return res.status(400).send('No preferred UPI set');

    const vpa = decrypt(preferred.vpa_encrypted);
    const qrImage = await generateUpiQr(vpa, user.name);

    res.json({ qrImage });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate QR');
  }
}

async function handlePaymentLink(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    const preferred = user.upis.id(user.preference.preferredUpiId);
    if (!preferred) return res.status(400).send('No preferred UPI set');

    const vpa = decrypt(preferred.vpa_encrypted);
    const upiLink = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(user.name)}&cu=INR`;

    // redirect to UPI deep link
    res.redirect(upiLink);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to process payment link');
  }
}

module.exports = { getQr, handlePaymentLink };
