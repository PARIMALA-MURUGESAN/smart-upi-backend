const User = require('../models/User');
const { generateUpiQr } = require('../services/qrService');

const { decrypt } = require('../services/enc');
const History = require('../models/History');
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
    res.status(500).send('Failed to process payment link');
  }
}


module.exports = { getQr, handlePaymentLink };
